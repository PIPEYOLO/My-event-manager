import { mongo, startSession } from "mongoose";
import { EVENT_NOT_FOUND, FILE_NOT_FOUND, INVITATION_NOT_FOUND, StandardError, SUBSCRIBED_USER_NOT_FOUND, UNAUTHORIZED, UNEXPECTED_SERVER_ERROR, UNVALID_PAYLOAD_DATA, USER_IS_ALREADY_JOINED_TO_EVENT, USER_IS_NOT_ALLOWED_TO_EDIT_EVENT, USER_IS_NOT_JOINED_TO_EVENT } from "../../../../../errors/index.js";
import { manageUnhandledServerError } from "../../../../../errors/management/index.js";
import { getDocumentValidationErrorsInStringFormat } from "../../../../../errors/modelValidation/index.js";
import { castFieldsToObjectId } from "../../../../../object_id/index.js";
import { INVITATION_MODEL_COLLECTION_NAME } from "../../../config.js";
import { Event as EventModel } from "../../../index.js";
import { findEventForCreator__Filter, findEventForUser__Filter, findEventsForUser__Filter, getSpecificSubscriber__Selector, getSubscribedUsers__Selector, subscribeUserToEvent__Update, unsubscribeUserFromEvent__Update, userCanJoinEvent__Filter } from "../../../queryObjects/Event/index.js";
import { parseAndValidateOptions } from "../../../../../options/parseAndValidate/index.js";
import { setPhoto__Update, unsetPhoto__Update } from "../../../queryObjects/__common/index.js";
import { deleteFileFromDB, uploadFileToDB } from "../../../../../files/db/index.js";



export const eventStaticMethods = {
  // queries:
  getEventForUser__Query: function (event_id, user_id) {
    return this.findOne(findEventForUser__Filter(event_id, user_id));
  },

  createEvent: async function (eventData) {
    delete eventData._id; // avoid an user arbitrary _id being set

    const { creator_id } = eventData;
    const event = new EventModel(eventData);
    const validation = event.validateSync();
    if(validation != undefined) {
      const message = getDocumentValidationErrorsInStringFormat(validation);
      return { success: false, error: UNVALID_PAYLOAD_DATA.getWithCustomMessage(message)};     
    };

    // subscribe the creator to his event
    const subscriber = event.subscribedUsers.create({ _id: creator_id }); 
    event.subscribedUsers.push(subscriber);

    let result;
    try {
      const { photo } = eventData;
      // Upload the new photo file if its present
      if(photo !== undefined) {
        const fileUploadResult = await uploadFileToDB(photo.path, photo);
        if(fileUploadResult.success === false) throw fileUploadResult.error;
        const file_id = fileUploadResult.data._id;
        event.photo = { file_id }; // set the photo file_id
      }

      // save the event
      result = await event.save();
    }
    catch(err) {
      if(err instanceof StandardError) return { success: false, error: err };
      manageUnhandledServerError(err);
      return {
        success: false,
        error: UNEXPECTED_SERVER_ERROR.getWithCustomMessage("Could not create event")
      }
    };


    return {
      success: true, 
      data: result
    };
  },
  updateEvent: async function (event_id, user_id, eventData) {
    delete eventData._id; // avoid an user arbitrary _id being set
    delete eventData.subscribedUsers;

    
    const _idsInfo = castFieldsToObjectId({ event_id, user_id });
    if(_idsInfo.success === false) return _idsInfo;

    event_id = _idsInfo.data.event_id;
    user_id = _idsInfo.data.user_id;

    // We get the document:
    let eventDoc;
    try {
      eventDoc = await this.findOne(findEventForUser__Filter(event_id, user_id));
    }
    catch(err) {
      manageUnhandledServerError(err);
      return { success: false, error: UNEXPECTED_SERVER_ERROR.getWithCustomMessage("Could not update event") } ;
    }

    if(eventDoc == null) return { success: false, error: EVENT_NOT_FOUND };

    // Verify if user can change event
    if(eventDoc.creator_id.equals(user_id) === false) return { success: false, error: UNAUTHORIZED.getWithCustomMessage("You do not have permissions to update this event") };

    // Do the action
    try {
      // Set photo in the event
      let photoWasModified = false;
      if(eventData.photoAction === "delete") {
        const photoDeletionResult = await this.deletePhoto(event_id, user_id);
        if(photoDeletionResult.success === false) throw UNEXPECTED_SERVER_ERROR.getWithCustomMessage("Could not update event");
        photoWasModified = true;
      }
      else if(eventData.photoAction === "update" && eventData.photo !== undefined) {
        const photoSetResult = await this.setPhoto(event_id, user_id, eventData.photo);
        if(photoSetResult.success === false) throw UNEXPECTED_SERVER_ERROR.getWithCustomMessage("Could not update event");
        photoWasModified = true;
      }
      else if(eventData.photoAction === "update" && eventData.photo == undefined) {
        throw UNVALID_PAYLOAD_DATA.getWithCustomMessage("To upload the photo a 'photoAction' field must be 'update'");
      }

      // Update the rest of the eventData
      const newEventData = { ...eventData };
      delete newEventData.photo; // prevent from reassigning the photo prop

      Object.assign(eventDoc, newEventData);
      
      // Validate the doc
      try {
        await eventDoc.validate();
      }
      catch(validationError) {
        const message = getDocumentValidationErrorsInStringFormat(validationError);
        throw UNAUTHORIZED.getWithCustomMessage(message)
      }

      if(eventDoc.isModified() === false && photoWasModified === false) throw UNVALID_PAYLOAD_DATA.getWithCustomMessage("No valid update fields were specified");
      // Save the doc
      await eventDoc.save();

    }
    catch(err) {
      if(err instanceof StandardError) return { success: false, error: err };
      manageUnhandledServerError(err);
      return { success: false, error: UNEXPECTED_SERVER_ERROR.getWithCustomMessage("Could not update event") };
    }

    return { success: true, data: eventDoc };
  },
  changeEventPublicState: async function (event_id, changerUser_id, newState) {
    const _idsInfo = castFieldsToObjectId({ event_id, changerUser_id });
    if(_idsInfo.success === false) return _idsInfo;

    event_id = _idsInfo.data.event_id;
    changerUser_id = _idsInfo.data.changerUser_id;

    let event;
    try {
      event = await this.findOne(
        findEventForUser__Filter(event_id, changerUser_id),
        { creator_id: 1, isPublic: 1 }
      )
    }
    catch(err) {
      manageUnhandledServerError(err);
      return { success: false, error: UNEXPECTED_SERVER_ERROR.getWithCustomMessage("Could not change public state") };
    };

    if(event == null) return { success: false, error: EVENT_NOT_FOUND };

    if(event.creator_id.toString() !== changerUser_id.toString() ) return { success: false, error: USER_IS_NOT_ALLOWED_TO_EDIT_EVENT }; // if changer is not the creator 
    if(event.isPublic === newState) return { success: false, error: UNVALID_PAYLOAD_DATA.getWithCustomMessage(`Event was already ${event.isPublic ? "public" : "private"}`) }; // check if it was alreay public | ´private

    event.isPublic = newState;

    // validate the doc.path
    const validation = event.validateSync(["isPublic"]);
    if(validation != undefined) {
      const message = getDocumentValidationErrorsInStringFormat(validation);
      return { success: false, error: UNVALID_PAYLOAD_DATA.getWithCustomMessage(message) };
    };


    // do the action
    let result; 
    try {
      await event.save();
    }
    catch(err) {
      manageUnhandledServerError(err);
      return { success: false, error: UNEXPECTED_SERVER_ERROR.getWithCustomMessage("Could not change public state")};
    }

    return { success: true, data: result };

  },
  makeUserJoinAnEvent: async function (event_id, user_id, options) {
    const { joiningWithInvitation=false, session } = options ?? {};
    
    const _idsInfo = castFieldsToObjectId({ event_id, user_id });
    if(_idsInfo.success === false) return _idsInfo;

    event_id = _idsInfo.data.event_id;
    user_id = _idsInfo.data.user_id;

    const updateFilter = joiningWithInvitation === true ? { _id: event_id } : findEventForUser__Filter(event_id, user_id)
    // Find the event
    let event;
    try {
      event = await this.findOne(updateFilter).select(getSpecificSubscriber__Selector(user_id));
    }
    catch(err) {
      manageUnhandledServerError(err);
      return { success: false, error: UNEXPECTED_SERVER_ERROR.getWithCustomMessage("Could not join the event") };
    };

    if(event == null) return { success: false, error: EVENT_NOT_FOUND };

    if(event.subscribedUsers[0] != undefined) return { success: false, error: USER_IS_ALREADY_JOINED_TO_EVENT };

    const newSubscriber = event.subscribedUsers.create({ _id: user_id }); // add the user


    // do the subscription
    let result;
    try {
      result = await this.findByIdAndUpdate(
        event_id,
        subscribeUserToEvent__Update(newSubscriber),
        {
          new: true,
          session
        }
      );
    }
    catch(err) {
      manageUnhandledServerError(err);
      return { success: false, error: UNEXPECTED_SERVER_ERROR.getWithCustomMessage("Could not join the event") };
    }

    return { success: true, data: result };
  }, 
  makeUserLeaveEvent: async function (event_id, user_id) {
    const _idsInfo = castFieldsToObjectId({ event_id, user_id });
    if(_idsInfo.success === false) return _idsInfo;

    event_id = _idsInfo.data.event_id;
    user_id = _idsInfo.data.user_id;

    // instanciate eventdoc
    let event;
    try {
      event = await this.getEventForUser__Query(event_id, user_id).select(getSpecificSubscriber__Selector(user_id));
    }
    catch(err) {
      return { success: false, error: UNEXPECTED_SERVER_ERROR.getWithCustomMessage("Could not leave event") };
    }

    if(event == null) return { success: false, error: EVENT_NOT_FOUND };

    const userSubscribed = event.subscribedUsers[0];

    if(userSubscribed == undefined) return { success: false, error: USER_IS_NOT_JOINED_TO_EVENT };
    
    // leave the event
    let result;
    try {
      result = await this.findByIdAndUpdate(
        event_id,
        unsubscribeUserFromEvent__Update(user_id),
        {
          fields: { _id: 1 }
        }
      );
    }
    catch(err) {
      manageUnhandledServerError(err);
      return { success: false, error: UNEXPECTED_SERVER_ERROR.getWithCustomMessage("Could not leave event") };
    };

    return { success: true, data: result };
  },
  setPhoto: async function (event_id, user_id, file) {
    const _idsInfo = castFieldsToObjectId({ event_id, user_id });
    if(_idsInfo.success === false) return _idsInfo;

    event_id = _idsInfo.data.event_id;
    user_id = _idsInfo.data.user_id;

    let event;
    let result;
    try {
      // check event existance and if user is authorized
      event = await this.getEventForUser__Query(event_id, user_id).select({ creator_id: 1, photo: 1 });

      if(event == null) throw EVENT_NOT_FOUND;

      if(event.creator_id.equals(user_id) === false) throw UNAUTHORIZED.getWithCustomMessage("You do not have permitions to change this event's photo"); 
  
      const oldPhoto = event.photo;

      // Delete the old file if exists
      if(oldPhoto?.file_id instanceof mongo.ObjectId) {
        const deletionResult = await deleteFileFromDB(oldPhoto.file_id, { okIfNotFound: true });
        if(deletionResult.success === false) throw deletionResult.error;
      }

      // Upload the new photo file
      const fileUploadResult = await uploadFileToDB(file.path, file);
      if(fileUploadResult.success === false) throw fileUploadResult.error;
  
      const file_id = fileUploadResult.data._id;

      // assign the new photo reference
      result = await this.findOneAndUpdate(
        { _id: event_id }, 
        setPhoto__Update(file_id),
        {
          new: true,
          fields: { photo: 1 },
        }
      );

    }
    catch(err) {
      if(err instanceof StandardError) return { success: false, error: err };
      manageUnhandledServerError(err);
      return { success: false, error: UNEXPECTED_SERVER_ERROR.getWithCustomMessage("Could not change photo") };
    }

    return { success: true, data: result };
  },
  deletePhoto: async function (event_id, user_id) {
    const _idsInfo = castFieldsToObjectId({ event_id, user_id });
    if(_idsInfo.success === false) return _idsInfo;

    event_id = _idsInfo.data.event_id;
    user_id = _idsInfo.data.user_id;

    let event;
    let result;
    try {
      // Check event existance an if user is authorized
      event = await this.getEventForUser__Query(event_id, user_id).select({ creator_id: 1, photo: 1 });
      
      if(event == null) throw EVENT_NOT_FOUND;
      if(event.creator_id.equals(user_id) === false) throw UNAUTHORIZED.getWithCustomMessage("You do not have permissions to delete the event photo");

      const oldPhoto = event.photo;

      if(oldPhoto?.file_id == undefined) throw UNAUTHORIZED.getWithCustomMessage("That event does not have a photo to delete");

      // delete the file
      const fileDeletion = await deleteFileFromDB(oldPhoto.file_id, { okIfNotFound: true });
      if(fileDeletion.success === false) throw fileDeletion.error;

      // unset the photo property
      result = await this.findByIdAndUpdate(event_id, unsetPhoto__Update(fileDeletion.data._id), {
        new: true,
        fields: { photo: 1 }
      });
    }
    catch(err) {
      if(err instanceof StandardError) return { success: false, error: err };
      manageUnhandledServerError(err);
      return { success: false, error: UNEXPECTED_SERVER_ERROR.getWithCustomMessage("Could not delete event photo") };
    }

    return { success: true, data: result };
  },
  deleteEvent: async function (event_id, user_id) {
    const _idsInfo = castFieldsToObjectId({ event_id, user_id });
    if(_idsInfo.success === false) return _idsInfo;

    event_id = _idsInfo.data.event_id;
    user_id = _idsInfo.data.user_id;

    // Getting the event
    const eventInfo = await this.getSpecificEventForUser(event_id, user_id);
    if(eventInfo.success === false) return eventInfo;

    const event = eventInfo.data;

    // checking that user_id is creator_id
    if(event.creator_id.equals(user_id) === false) return { success: false, error: UNAUTHORIZED.getWithCustomMessage("You are not allowed to delete this event") };

    // Delteting the event photo file if it exists
    if(event.photo?.file_id != undefined) {
      const fileDeletion = await deleteFileFromDB(event.photo.file_id, { okIfNotFound: true });
      if(fileDeletion.success === false) return { success: false, error: UNEXPECTED_SERVER_ERROR.getWithCustomMessage("Could not delete event") };
    }


    // Deltetion of the event
    let result;
    try {
      result = await this.deleteOne({ _id: event_id});
    }
    catch(err) {
      manageUnhandledServerError(err);
      return { success: false, error: UNEXPECTED_SERVER_ERROR.getWithCustomMessage("Could not delete event") };
    };

    if(result.deletedCount === 0) return { success: false, error: UNEXPECTED_SERVER_ERROR.getWithCustomMessage("Could not delete event") };


    return { success: true };

  },

  // Get Queries
  getSpecificEventForUser: async function (event_id, user_id) {
    const _idsInfo = castFieldsToObjectId({ event_id })
    if(_idsInfo.success === false) return _idsInfo;
    
    event_id = _idsInfo.data.event_id;
  
    let filter;
    if(user_id == undefined) {
      filter = { _id: event_id, isPublic: true };
    }
    else {
      const _idInfo = castFieldsToObjectId({ user_id });
      if(_idInfo.success === false) return _idInfo;
      user_id = _idInfo.data.user_id;

      filter = findEventForUser__Filter(event_id, user_id);
    };

    let result; 
    try {
      result = await EventModel.findOne(filter)
        .populate("creator");
    }
    catch(err) {
      return { success: false, error: UNEXPECTED_SERVER_ERROR.getWithCustomMessage("Could not get the event")}
    };
    
    if(result == null) {
      return { success: false, error: EVENT_NOT_FOUND };
    };


    return { success: true, data: result };


  },
  getEventCreatedInvitationsForUser: async function(event_id, user_id, options={}) {
    const _idsInfo = castFieldsToObjectId({ event_id, user_id });
    if(_idsInfo.success === false) return _idsInfo;

    event_id = _idsInfo.data.event_id;
    user_id = _idsInfo.data.user_id;

    
    const optionsValidation = parseAndValidateOptions(options, { skip: 0, limit: 10 });
    if(optionsValidation.success === false) return optionsValidation;
    
    const { skip, limit } = optionsValidation.options;

    let result;
    try {
      result = await this.findOne(findEventForCreator__Filter(event_id, user_id))
      .populate({
        path: "invitations", // we populate the invitations virtual
        options: { skip, limit, sort: { _id: -1} }// use the OPTIONS input
      });
    }
    catch(err) {
      manageUnhandledServerError(err);
      return { success: false, error: UNEXPECTED_SERVER_ERROR.getWithCustomMessage("Could not get event invitations")};
    };

    if(result == null) {
      return { success: false, error: EVENT_NOT_FOUND.getWithCustomMessage("That event might not exist or you are not the creator of it") };
    };

    if(result.invitations.length === 0) {
      return { success: false, error: INVITATION_NOT_FOUND.getWithCustomMessage("That event does not have invitations created"), data: result.invitations };
    }


    return { success: true, data: result.invitations };

  },
  getEventInvitedUsersForUser: async function (event_id, user_id) {
    const _idsInfo = castFieldsToObjectId({ event_id, user_id });
    if(_idsInfo.success === false) return _idsInfo;

    event_id = _idsInfo.data.event_id;
    user_id = _idsInfo.data.user_id;

    let result;
    try {
      result = 
      await this.aggregate()
        .match(findEventForUser__Filter(event_id, user_id))
        .limit(1) // just one
        .project({ event_id: 1, creator_id: 1 })
        .lookup({ // we get the invitations of the event
          from: INVITATION_MODEL_COLLECTION_NAME,
          foreignField: "event_id",
          localField: "_id",
          as: "invitations",
          pipeline: [ { $sort: { _id: -1 } }] // the last invitations first
        })
        .project({ invitations: 1}) // select just the invitations
        .unwind("invitations") // unwind the $invitations field
        .replaceRoot("invitations") // we set the $invitations field as the root document 
        .project({ invitedUsers: 1, creationDate: 1 }) // select just the invitedUsers and creationDate of each invitation
        .unwind("invitedUsers") // unwind the invitedUsers
        .group({ // group the invitations because they have been invited many times
          _id: "$invitedUsers._id", // group the invitations by invitedUsers._id (for each disctinc user)
          invitedTimes: { $sum: 1 }
        })

    }
    catch(err) {
      manageUnhandledServerError(err);
      return { success: false, error: UNEXPECTED_SERVER_ERROR.getWithCustomMessage("Could not get event invited users")};
    };

    if(result == null) {
      return { success: false, error: EVENT_NOT_FOUND };
    };


    return { success: true, data: result };
  },
  getEventSubscribersForUser: async function (event_id, user_id, options={}) {
    const _idsInfo = castFieldsToObjectId({ event_id, user_id });
    if(_idsInfo.success === false) return _idsInfo;

    event_id = _idsInfo.data.event_id;
    user_id = _idsInfo.data.user_id

    // options:
    const parsedOptionsInfo = parseAndValidateOptions(options, { skip: 0, limit: 10 });
    if(parsedOptionsInfo.success === false) return parsedOptionsInfo;

    const { skip, limit } = parsedOptionsInfo.options;

    // Query:
    let result;
    try {
      result = await EventModel.findOne(findEventForUser__Filter(event_id, user_id), getSubscribedUsers__Selector({ skip, limit }))
      .populate("subscribedUsers.user");
    }
    catch(err) {
      manageUnhandledServerError(err);
      return { success: false, error: UNEXPECTED_SERVER_ERROR.getWithCustomMessage("Could not get subscribed users") };
    };

    if(result == null) return { success: false, error: EVENT_NOT_FOUND };

    if(result.subscribedUsers.length === 0) return { success: false, error: SUBSCRIBED_USER_NOT_FOUND };

    return { success: true, data: result.subscribedUsers };
  },
  getEventsForUser: async function (user_id, options={}) {
    const _idInfo = castFieldsToObjectId({ user_id });
    if(_idInfo.success === false) return _idInfo;

    user_id = _idInfo.data.user_id;

    // Options:
    const optionsValidation = parseAndValidateOptions(options, { skip: 0, limit: 10, type: "pending", closest: true, subscribed: true, search: "" });
    if(optionsValidation.success === false) return optionsValidation;
    
    const { skip, limit, type, closest, subscribed, search } = optionsValidation.options;

    // Filter:
    let filter = findEventsForUser__Filter(user_id, { type,  subscribed, search });

    // Query: 
    let result;
    try {
      result = await this.find(
        filter
      )
      .sort({ startDate: closest ? 1 : -1 }) // sort by startDate: closest - closelesslest¿
      .skip(skip).limit(limit)
      .populate("creator");
    }
    catch(err) {
      manageUnhandledServerError(err);
      return {
        success: false,
        error: UNEXPECTED_SERVER_ERROR.getWithCustomMessage("Could not get events")
      };
    };

    if(result.length === 0) {
      return {
        success: false,
        error: EVENT_NOT_FOUND.getWithCustomMessage(`You have not any ${type} events`),
        data: result
      }
    };

    return { sucess: true, data: result };
  },
}
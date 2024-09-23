import mongoose, { Query, startSession } from "mongoose"
import { EVENT_NOT_FOUND, INVITATION_NOT_FOUND, StandardError, UNAUTHORIZED, UNEXPECTED_SERVER_ERROR, UNVALID_PAYLOAD_DATA } from "../../../../../errors/index.js";
import { manageUnhandledServerError } from "../../../../../errors/management/index.js";
import { castFieldsToObjectId } from "../../../../../object_id/index.js";
import { Event as EventModel, Invitation } from "../../../index.js";
import { getDocumentValidationErrorsInStringFormat } from "../../../../../errors/modelValidation/index.js";
import { findInvitationsOfUser__Filter } from "../../../queryObjects/Invitation/index.js";
import { parseAndValidateOptions } from "../../../../../options/parseAndValidate/index.js";
import { getEventPublicInfo__Selector } from "../../../queryObjects/Event/index.js";
import { getUserPublicInfo__Selector } from "../../../queryObjects/User/index.js";



export const invitationStaticMethods = {
  // Queries:
  getSpecificInvitationForUser__Query: function (invitation_id, user_id) {
    return Invitation.findOne({ 
      _id: invitation_id, // the invitation
      $or: [
        { creator_id: user_id }, // it should be the creator
        { "invitedUsers._id": user_id } // or an invited user
      ] 
    });
  },

  // Methods:
  createInvitation: async function ({ event_id, creator_id, invitedUsers_ids, description }) {
    if(Array.isArray(invitedUsers_ids) === false) {
      return { success: false, error: UNVALID_PAYLOAD_DATA.getWithCustomMessage("invitedUsers_ids must be an array") };
    };
    const _idsInfo = castFieldsToObjectId({ event_id, creator_id, ...Object.fromEntries(invitedUsers_ids.map((value, idx) => [`invitedUsers_ids[${idx}]`, value] )) });
    if(_idsInfo.success === false) return _idsInfo;


    // We verify that the event exists and if the invitation creator is allowed to create an invitation
    const event = await EventModel.findById(event_id).select([ "creator_id", "isPublic" ]);
    if(event == null) return { success: false, error: EVENT_NOT_FOUND };

    if(event.isPublic === false && creator_id.toString() !== event.creator_id.toString() ) 
      return { success: false, error: UNAUTHORIZED.getWithCustomMessage("Cannot create an invitation to an event without the needed permissions") };

    
    // We prepare the fields
    event_id = _idsInfo.data.event_id;
    creator_id = _idsInfo.data.creator_id;
    invitedUsers_ids = Object.entries(_idsInfo.data)
      .filter((entry) => /^invitedUsers_ids\[[(\d)]{1,}\]$/.test(entry[0]) )
      .map((entry) => entry[1]); // we get all the invited users _ids

  
    const invitationDoc = new this({ event_id, creator_id, description })

    const invitedUsersSubDocs = invitedUsers_ids.map(_id => invitationDoc.invitedUsers.create({ _id }))
    invitationDoc.invitedUsers.push(
      ...invitedUsersSubDocs
    );


    // we do the validation (also the async ones)
    try {
      await invitationDoc.validate();
    }
    catch(validationError) {
      const message = getDocumentValidationErrorsInStringFormat(validationError);
      return { success: false, error: UNAUTHORIZED.getWithCustomMessage(message) };
    }


    // if its validated correctly try and save it:
    let result;
    try {
      result = await invitationDoc.save();
    }
    catch(err) {
      manageUnhandledServerError(err);
      return { success: false, error: UNEXPECTED_SERVER_ERROR.getWithCustomMessage("Could not create an invitation to the event") };
    };

    return { success: true, data: result };


  },
  makeUserUseInvitation: async function (invitation_id, user_id, newUsageState) {
    const _idsInfo = castFieldsToObjectId({ invitation_id, user_id });
    if(_idsInfo.success === false) return _idsInfo;

    user_id = _idsInfo.data.user_id;
    invitation_id = _idsInfo.data.invitation_id;
    
    let session;
    let eventDoc;
    try {
      session = await startSession();
      await session.withTransaction(async () => {

        // get the invitation from db
        let invitation = await this.getSpecificInvitationForUser__Query(invitation_id, user_id).select({ event_id: 1, invitedUsers: { $elemMatch: { _id: user_id } } });
        if(invitation == null) throw INVITATION_NOT_FOUND;

        const userInInvitation = invitation.invitedUsers[0];

        // if user had used the invitation, rebound its request
        if(userInInvitation.usageState !== "pending") throw UNAUTHORIZED.getWithCustomMessage(`That invitation was already ${userInInvitation.usageState}`);

        // set the new Value
        userInInvitation.usageState = newUsageState;
        
        await invitation.save({ session }); // save the doc
        
        if(userInInvitation.usageState === "rejected") return; // finish operation in case of rejection

        // if the invitation was marked correctly, make the user join the event with invitation set to true
        const joinResult = await EventModel.makeUserJoinAnEvent(invitation.event_id, user_id, { joiningWithInvitation: true, session });
        if(joinResult.success === false) throw joinResult.error; // if could not join throw the error and finish transaction

        eventDoc = joinResult.data;
      })
      session.endSession()
    }
    catch(err) {
      if(session !== undefined) session.endSession();
      if(err instanceof StandardError) return { success: false, error: err };

      manageUnhandledServerError(err);
      return { success: false, error: UNEXPECTED_SERVER_ERROR.getWithCustomMessage("Could not use the invitation") };
    }

    if(session !== undefined) session.endSession();

    return { success: true, data: eventDoc };
  },
  deleteInvitation: async function (invitation_id, deleterUser_id) {
    const _idsInfo = castFieldsToObjectId({ invitation_id, deleterUser_id });
    if(_idsInfo.success === false) return _idsInfo;

    invitation_id = _idsInfo.data.invitation_id;
    deleterUser_id = _idsInfo.data.deleterUser_id;

    let result;
    try {
      result = await this.findOneAndDelete(
        { _id: invitation_id, creator_id: deleterUser_id }
      )
    }
    catch(err) {
      manageUnhandledServerError(err);
      return { success: false, error: UNEXPECTED_SERVER_ERROR.getWithCustomMessage("Could not delete the invitation")}
    };

    if(result == null) {
      return { success: false, error: INVITATION_NOT_FOUND };
    };


    return { success: true, data: result };

  },


  
  getSpecificInvitationForUser: async function(invitation_id, user_id) {
    const _idsInfo = castFieldsToObjectId({ invitation_id, user_id });
    if(_idsInfo.success === false) return _idsInfo;

    invitation_id = _idsInfo.data.invitation_id;
    user_id = _idsInfo.data.user_id;

    let result;
    try {
      result = await this.getSpecificInvitationForUser__Query(invitation_id, user_id)
        .populate([ 
          { 
            path: "event", 
            select: getEventPublicInfo__Selector(),
            populate: { path: "creator", select: getUserPublicInfo__Selector() }
          }, 
          { path: "creator" } 
        ]);
    }
    catch(err) {
      manageUnhandledServerError(err);
      return { success: false, error: UNEXPECTED_SERVER_ERROR.getWithCustomMessage("Could not get invitation")};
    };

    if(result == null) {
      return { success: false, error: INVITATION_NOT_FOUND };
    };


    return { success: true, data: result };
  },
  getInvitationsOfUser: async function (user_id, options={}) {
    const _idInfo = castFieldsToObjectId({ user_id })
    if(_idInfo.success === false) {
      return _idInfo;
    };

    user_id = _idInfo.data.user_id;

    // Options:
    const optionsValidation = parseAndValidateOptions(options, { skip: 0, limit: 10, type: "all", search: "", recent: true });
    if(optionsValidation.success === false) return optionsValidation;

    const { skip, limit, type, search, recent } = optionsValidation.options;

    // Query
    let result; 
    try {
      result = await Invitation.find(
        findInvitationsOfUser__Filter(user_id, { type, search }), // find the invitations where the user appears
      )
      .sort({ _id: recent ? -1 : 1 })
      .skip(skip).limit(limit)
      .populate({
        path: "creator",
        select: getUserPublicInfo__Selector()
      })
      .populate({
        path: "event",
        select: getEventPublicInfo__Selector()
      })
    }
    catch(err) {
      manageUnhandledServerError(err);
      return { success: false, error: UNEXPECTED_SERVER_ERROR.getWithCustomMessage("Could not get user invitations") };
    }

    if(result.length === 0) {
      let message = "You do not have any invitations";
      return { success: false, error: INVITATION_NOT_FOUND.getWithCustomMessage(message), data: result };
    };

    return { success: true, data: result };

  },
  getCreatedInvitationsOfUser: async function (user_id, options={}) {
    const _idInfo = castFieldsToObjectId({ user_id });
    if(_idInfo.success === false) {
      return _idInfo;
    };

    user_id = _idInfo.data.user_id;


    // Options:
    const optionsValidation = parseAndValidateOptions(options, { skip: 0, limit: 10 });
    if(optionsValidation.success === false) return optionsValidation;

    const { skip, limit, type } = optionsValidation.options;

    // Query:
    let result;
    try {
      result = await this.find(
        { creator_id: user_id }
      )
      .sort({ _id: -1 })
      .skip(skip).limit(limit);
    }
    catch(err) {
      manageUnhandledServerError(err);
      return { success: false, error: UNEXPECTED_SERVER_ERROR.getWithCustomMessage("Could not get created invitations") };
    };

    if(result.length === 0) {
      return { success: false, error: INVITATION_NOT_FOUND.getWithCustomMessage("You have not created any invitations yet"), data: result };
    };

    return { success: true, data: result };

  },
}
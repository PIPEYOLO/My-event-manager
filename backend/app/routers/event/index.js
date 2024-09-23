import e from "express";
import { authorizationRequired } from "../../middlewares/auth/index.js";
import { getUserAuthInfo } from "../../../services/cookie/auth/index.js";
import { Event as EventModel, User } from "../../../services/db/models/index.js";
import { ACTION_WAS_NOT_IMPLEMENTED, UNVALID_PAYLOAD_DATA } from "../../../services/errors/index.js";
import { entityPhotoMulterInstance, eventCreationAndEditionMulterInstance } from "../../middlewares/forms/index.js";
import { getEventsRateLimiter, getSpecificEventRateLimiter, eventCreationAndEditionRateLimiter, eventPhotoChangeRateLimiter, eventActionRateLimiter } from "../../middlewares/limiters/events.js";

const eventRouter = e.Router();

eventRouter.get("/", getEventsRateLimiter, authorizationRequired(), async (req, res) => {
  const { _id: user_id } = getUserAuthInfo(req).data;
  const { action } = req.query;
  

  let result = await EventModel.getEventsForUser(user_id, { type: action, ...req.query });

  return res.status(result.error?.status ?? 200).send(result);

});

eventRouter.get("/:event_id", getSpecificEventRateLimiter, authorizationRequired({ type: "notStrict"}), async (req, res) => {
  const { event_id } = req.params;
  const { action, skip, limit } = req.query;
  
  const user_id = getUserAuthInfo(req).data?._id;

  let result;
  if(action === "itself") {
    result = await EventModel.getSpecificEventForUser(event_id, user_id);
  }
  else if(action === "invitations") {
    result = await EventModel.getEventCreatedInvitationsForUser(event_id, user_id, { skip, limit });
  }
  else if(action === "invitedUsers") {
    result = await EventModel.getEventInvitedUsersForUser(event_id, user_id);
  }
  else if(action === "subscribedUsers") {
    result = await EventModel.getEventSubscribersForUser(event_id, user_id, { skip, limit });
  }
  else {
    return res.status(ACTION_WAS_NOT_IMPLEMENTED.status).send({ success: false, error: ACTION_WAS_NOT_IMPLEMENTED });
  }


  return res.status(result.error?.status ?? 200).send(result);
  
})

eventRouter.post("/", eventCreationAndEditionRateLimiter, authorizationRequired(), eventCreationAndEditionMulterInstance.single("photo"), async (req, res) => {
  const { _id: user_id } = getUserAuthInfo(req).data;

  const result = await EventModel.createEvent({ ...req.body, photo: req.file, creator_id: user_id });

  return res.status(result.error?.status ?? 201).send(result);
  
});

eventRouter.patch("/:event_id", eventCreationAndEditionRateLimiter, authorizationRequired(), eventCreationAndEditionMulterInstance.single("photo"), async (req, res) => {
  const { _id: user_id } = getUserAuthInfo(req).data;
  const { event_id } = req.params;

  const result = await EventModel.updateEvent(event_id, user_id, { ...req.body, photo: req.file });

  return res.status(result.error?.status ?? 201).send(result);
  
});


eventRouter.patch("/:event_id/photo/:action", eventPhotoChangeRateLimiter, authorizationRequired(), entityPhotoMulterInstance.single("newPhoto"), async (req, res) => {
  const user_id = getUserAuthInfo(req).data._id;
  const { event_id, action } = req.params;
  const file = req.file;

  let result;
  if(action === "change") {
    if(file == undefined) return res.status(UNVALID_PAYLOAD_DATA.status).send({ success: false, error: UNVALID_PAYLOAD_DATA.getWithCustomMessage("newPhoto file, to change photo must be defined") });
    result = await EventModel.setPhoto(event_id, user_id, file);
  }
  else if(action === "delete") {
    result = await EventModel.deletePhoto(event_id, user_id);
  }
  else return res.status(ACTION_WAS_NOT_IMPLEMENTED.status).send({ success: false, error: ACTION_WAS_NOT_IMPLEMENTED });


  return res.status(result.error?.status ?? 200).send(result);
});

eventRouter.patch("/:event_id/:action", eventActionRateLimiter, authorizationRequired(), async (req, res) => {
  const { event_id, action } = req.params;
  const { _id : user_id } = getUserAuthInfo(req).data;

  let result;
  if(action === "makePublic") {
    result = await EventModel.changeEventPublicState(event_id, user_id, true);
  }
  else if(action === "makePrivate") {
    result = await EventModel.changeEventPublicState(event_id, user_id, false);
  }
  else if(action === "join") {
    result = await EventModel.makeUserJoinAnEvent(event_id, user_id);
  }
  else if(action === "leave") {
    result = await EventModel.makeUserLeaveEvent(event_id, user_id);
  }
  else {
    return res.status(ACTION_WAS_NOT_IMPLEMENTED.status).send({ success: false, error: ACTION_WAS_NOT_IMPLEMENTED });
  }

  return res.status(result.error?.status ?? 200).send(result);

});





export default eventRouter;

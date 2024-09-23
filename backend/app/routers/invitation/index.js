import e from "express";
import { authorizationRequired } from "../../middlewares/auth/index.js";
import { getUserAuthInfo } from "../../../services/cookie/auth/index.js";
import { Invitation } from "../../../services/db/models/index.js";
import { ACTION_WAS_NOT_IMPLEMENTED } from "../../../services/errors/index.js";
import { getInvitationsRateLimiter, getSpecificInvitationRateLimiter, invitationCreationRateLimiter, invitationManagementRateLimiter, invitationDeletionRateLimiter } from "../../middlewares/limiters/invitation.js";


const invitationRouter = e.Router();

invitationRouter.get("/", getInvitationsRateLimiter, authorizationRequired(), async (req, res) => {
  const { _id : user_id } = getUserAuthInfo(req).data;
  const { action } = req.query;

  let result;
  if(action === "received" || action === "pending" || action === "accepted" || action === "rejected") {
    result = await Invitation.getInvitationsOfUser(user_id, { type: action, ...req.query});
  }
  else if(action === "created") {
    result = await Invitation.getCreatedInvitationsOfUser(user_id, { ... req.query });
  }
  else {
    return res.status(ACTION_WAS_NOT_IMPLEMENTED.status).send({ success: false, error: ACTION_WAS_NOT_IMPLEMENTED });
  }

  return res.status(result.error?.status ?? 200).send(result);
})

invitationRouter.get("/:invitation_id", getSpecificInvitationRateLimiter, authorizationRequired(), async (req, res) => {
  const user_id = getUserAuthInfo(req).data._id;
  const { invitation_id } = req.params;
  
  const result = await Invitation.getSpecificInvitationForUser(invitation_id, user_id);

  return res.status(result.error?.status ?? 200).send(result);
})

invitationRouter.post("/", invitationCreationRateLimiter, authorizationRequired(), e.json({ limit: "10kb"}), async (req, res) => {
  const user_id = getUserAuthInfo(req).data._id;

  const result = await Invitation.createInvitation({ creator_id: user_id, ...req.body, });

  return res.status(result.error?.status ?? 201).send(result);
})

invitationRouter.patch("/:invitation_id/:action", invitationManagementRateLimiter, authorizationRequired(), async (req, res) => {
  const { invitation_id, action } = req.params;
  const user_id = getUserAuthInfo(req).data._id;

  let result;
  if(action === "accept") {
    result = await Invitation.makeUserUseInvitation(invitation_id, user_id, "accepted");
  }
  else if(action === "reject") {
    result = await Invitation.makeUserUseInvitation(invitation_id, user_id, "rejected");
  }
  else {
    return res.status(ACTION_WAS_NOT_IMPLEMENTED.status).send({ success: false, error: ACTION_WAS_NOT_IMPLEMENTED })
  }


  return res.status(result.error?.status ?? 200).send(result);
});


invitationRouter.delete("/:invitation_id", invitationDeletionRateLimiter, authorizationRequired(), async (req, res) => {
  const user_id = getUserAuthInfo(req).data._id;
  const { invitation_id } = req.params;

  const result = await Invitation.deleteInvitation(invitation_id, user_id);

  return res.status(result.error?.status ?? 200).send(result);
})


export default invitationRouter;



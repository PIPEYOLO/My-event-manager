import { model } from "mongoose";
import { connectToDatabase } from "../conn.js";
import userSchema from "./Schemas/User/index.js";
import eventSchema from "./Schemas/Event/index.js";
import invitationSchema from "./Schemas/Invitation/index.js";
import { EVENT_MODEL_COLLECTION_NAME, INVITATION_MODEL_COLLECTION_NAME, USER_MODEL_COLLECTION_NAME } from "./config.js";



export const User = model(USER_MODEL_COLLECTION_NAME, userSchema, USER_MODEL_COLLECTION_NAME);
export const Event = model(EVENT_MODEL_COLLECTION_NAME, eventSchema, EVENT_MODEL_COLLECTION_NAME);
export const Invitation = model(INVITATION_MODEL_COLLECTION_NAME, invitationSchema, INVITATION_MODEL_COLLECTION_NAME);





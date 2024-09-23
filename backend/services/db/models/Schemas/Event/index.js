import { Schema } from "mongoose";
import { validateEventDescription, validateEventName } from "../../../../../../utils/validators/event/index.js";
import { eventStaticMethods } from "./methods/index.js";
import subscribedUsers_subschema from "./subschemas/subscribedUsers.js";
import { INVITATION_MODEL_COLLECTION_NAME, USER_MODEL_COLLECTION_NAME } from "../../config.js";
import fileReference__subschema from "../__common/FileRef/index.js";



const eventSchema = new Schema({
  name: {
    type: String,
    validate: [{
      validator: function (v){
        const validation = validateEventName(v);
        if(validation.isValid) return true;
        throw validation.message;
      },
      message: props => props.reason
    }],
    required: [true, "Event name is required"],
    index: {
      unique: false,
      type: 1
    }
  },
  description: {
    type: String,
    validate: [{
      validator: function (v) {
        const { isValid, message } = validateEventDescription(v);
        if(isValid) return true;
        throw message;
      },
      message: props => props.reason
    }],
    required: [true, "Event description is required"]
  },
  creationDate: {
    type: Date,
    default: () => new Date(),
    immutable: [true, "Event creation date is immutable"]
  },
  creator_id: {
    type: Schema.Types.ObjectId,
    required: [true, "Event must have a creator_id"],
    immutable: [ true, "Event creator_id is immutable"]
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  startDate: {
    type: Date,
    required: [ true, "Event start date is required" ]
  },
  subscribedUsers: [subscribedUsers_subschema],
  photo: fileReference__subschema
}, {
  statics: eventStaticMethods,
  virtuals: {
    url: {
      get: function () { return `/event/${this._id}` } 
    },
    invitations: { 
      type: Schema.Types.Mixed,
      options: {
        ref: INVITATION_MODEL_COLLECTION_NAME,
        foreignField: "event_id",
        localField: "_id"
      }
    },
    creator: {
      type: Schema.Types.Mixed,
      options: {
        ref: USER_MODEL_COLLECTION_NAME,
        foreignField: "_id",
        localField: "creator_id",
        justOne: true
      }
    }
  },
  toJSON: { 
    virtuals: true, 
    transform: (doc, ret) => {
      delete ret.password; // exclude private info
      return ret;
    } 
  },
  toObject: { virtuals: true }
})



export default eventSchema;


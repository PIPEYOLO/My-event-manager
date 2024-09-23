import { mongo, Schema } from "mongoose";
import { Event as EventModel } from "../../index.js"
import { manageUnhandledServerError } from "../../../../errors/management/index.js";
import invitedUsers_subschema from "./subschemas/invitedUsers.js";
import { validateInvitationDescription } from "../../../../../../utils/validators/invitation/index.js";
import { invitationStaticMethods } from "./methods/index.js";
import { EVENT_MODEL_COLLECTION_NAME, USER_MODEL_COLLECTION_NAME } from "../../config.js";


const invitationSchema = new Schema({
  event_id: {
    type: Schema.Types.ObjectId,
    immutable: [ true, "Cannot mutate the invitation event_id"],
    required: [true, "Cannot create invitation without event_id"],
  },
  creator_id: {
    type: Schema.Types.ObjectId,
    required: [true, "Cannot create invitation without creator_id"]
  },
  creationDate: {
    type: Date,
    default: () => new Date()
  },
  description: {
    type: String,
    validate: [{
      validator: function (v) {
        const { isValid, message } = validateInvitationDescription(v);
        if(isValid) return true;
        throw message;
      },
      message: props => props.reason
    }]
  },
  invitedUsers: {
    type: [invitedUsers_subschema],
    validate: [
      {
        validator: function (invitedUsers) {
          if(invitedUsers.length === 0) throw "There are no invited users in this invitation";
          const _idsSet = new Set(invitedUsers.map(user => user._id.toString()));
          if(_idsSet.size !== invitedUsers.length) { // if there are any repeated users _ids
            throw "There are some repeated users in the invitation";
          }
          return true;
        },
        message: props => props.reason
      }
    ],
    required: [true, "Invitation must have invited users"]
  }
}, {
  statics: invitationStaticMethods,
  virtuals: {
    url: {
      get: function () { return `/invitation/${this._id}` } 
    },
    creator: {
      type: Schema.Types.Mixed,
      options: {
        ref: USER_MODEL_COLLECTION_NAME,
        foreignField: "_id",
        localField: "creator_id",
        justOne: true
      }
    },
    event: {
      type: Schema.Types.Mixed,
      options: {
        ref: EVENT_MODEL_COLLECTION_NAME,
        foreignField: "_id",
        localField: "event_id",
        justOne: true
      }
    }
  },
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})





export default invitationSchema;
import { Schema } from "mongoose";
import { manageUnhandledServerError } from "../../../../../errors/management/index.js";
import { USER_MODEL_COLLECTION_NAME } from "../../../config.js";
import { Invitation, User } from "../../../index.js";
import { INVITATION_NOT_FOUND } from "../../../../../errors/index.js";



const invitedUsers_subschema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    validate: [
      {
        validator: async function (_id) { // verify that user exists
          let result;
          try {
            result = await User.findById(_id).select("_id");
          }
          catch(err) {
            manageUnhandledServerError(err);
            throw "Could not create the invitation"
          }

          if(result == null) {
            throw `Cannot invite user of _id '${_id}' because it does not exist`;
          };

          return true;

        },
        message: props => props.reason
      }
    ],
    required: [true, "invited user _id is required"]
  },
  usageState: {
    type: String,
    validate: [
      { // verify that the new state is valid
        validator: function (v) {
          const possibleState = ["accepted", "rejected", "pending"];
          if(possibleState.includes(v) === false) throw `That invitation usageState for a user is not accepted. Usage state can only be: ${possibleState.map(state => `'${state}'`).join(", ")}`;
          return true;
        },
        message: props => props.reason
      }
    ],
    default: "pending"
  } 
}, {
  virtuals: {
    user: {
      type: Schema.Types.Mixed,
      options: {
        ref: USER_MODEL_COLLECTION_NAME,
        foreignField: "_id",
        localField: "_id",
        justOne: true
      }
    }
  },
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});


export default invitedUsers_subschema;
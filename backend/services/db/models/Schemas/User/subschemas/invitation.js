import { Schema } from "mongoose";
import { INVITATION_MODEL_COLLECTION_NAME } from "../../../config.js";


const invitation_subschema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: [true, "Event invitation _id is required"]
  },
  date: {
    type: Date,
    default: () => new Date()
  }
}, {
  virtuals: {
    invitation: {
      type: Schema.Types.Mixed,
      options: {
        ref: INVITATION_MODEL_COLLECTION_NAME,
        foreignField: "_id",
        localField: "_id",
        justOne: true
      }
    }
  },
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})


export default invitation_subschema;
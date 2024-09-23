import { Schema } from "mongoose";
import { USER_MODEL_COLLECTION_NAME } from "../../../config.js";



const subscribedUsers_subschema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: [true, "Subscribed user _id is required"],
    index: -1
  },
  date: {
    type: Date,
    default: ()=> new Date()
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
  toObject: { virtuals: true },
})




export default subscribedUsers_subschema;
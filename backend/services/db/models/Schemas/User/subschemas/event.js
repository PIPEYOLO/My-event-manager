import { Schema } from "mongoose";
import { EVENT_MODEL_COLLECTION_NAME } from "../../../config.js";



const event_subschema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: [true, "event _id is required"]
  }
},{
  virtuals: {
    event: {
      type: Schema.Types.Mixed,
      options: {
        ref: EVENT_MODEL_COLLECTION_NAME,
        foreignField: "_id",
        localField: "_id",
        justOne: true
      }
    }
  },
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})


export default event_subschema;
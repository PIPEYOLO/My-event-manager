import { Schema } from "mongoose";




const fileReference__subschema = new Schema({
  file_id: {
    type: Schema.Types.ObjectId
  }
},
{ 
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  virtuals: {
    path: {
      type: String,
      get: function () { return `/api/file/${this.file_id}` }
    }
  },
  id: false,
  _id: false
}
);


export default fileReference__subschema;
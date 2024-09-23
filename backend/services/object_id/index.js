import { mongo } from "mongoose";
import { UNVALID_PAYLOAD_DATA } from "../errors/index.js";



export function castFieldsToObjectId(fields) {
  for(let key of Object.keys(fields)) {
    const _id = fields[key];
    if(_id instanceof mongo.ObjectId) continue;
    if(/^[0-9a-fA-F]{24}$/.test(_id) === false) {
      return { success: false, error: UNVALID_PAYLOAD_DATA.getWithCustomMessage(`${key} must be a 24 hex string`)}
    };

    fields[key] = mongo.ObjectId.createFromHexString(_id);
  };
  
  return { success: true, data: fields };
}
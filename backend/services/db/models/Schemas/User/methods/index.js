import { mongo, startSession } from "mongoose";
import { UNEXPECTED_SERVER_ERROR, USER_NOT_FOUND } from "../../../../../errors/index.js";
import { manageUnhandledServerError } from "../../../../../errors/management/index.js";
import { User } from "../../../index.js";
import { castFieldsToObjectId } from "../../../../../object_id/index.js";
import { parseAndValidateOptions } from "../../../../../options/parseAndValidate/index.js";
import { searchByName__Filter } from "../../../queryObjects/__common/index.js";
import { getUserPublicInfo__Selector } from "../../../queryObjects/User/index.js";

export const userStaticMethods = {
  findUserByName: async function(name) {
    let result;
    try {
      result = await this.findOne({ name }, { name: 1, password: 1 });
    }
    catch(err) {
      manageUnhandledServerError(err);
      return {
        success: false,
        error: UNEXPECTED_SERVER_ERROR
      };
    };

    if(result == null) {
      return {
        success: false,
        error: USER_NOT_FOUND
      }
    }

    return {
      success: true,
      data: result
    }
  },
  getUserPublicInfo: async function(_id){
    const _idInfo = castFieldsToObjectId({ _id });
    if(_idInfo.success === false) return _idInfo;
    
    _id = _idInfo.data._id;

    // if _id is valid
    let result;
    try {
      result = await this.findById(_id, { name: 1 });
    }
    catch(err) {
      manageUnhandledServerError(err);
      return {
        success: false,
        error: UNEXPECTED_SERVER_ERROR
      };
    }

    if(result == null) {
      return {
        success: false,
        error: USER_NOT_FOUND
      }
    }

    return {
      success: true,
      data: result
    }
  },
  getUsers: async function (options) {
    // options:
    const optionsParseInfo = parseAndValidateOptions(options, { search: "", skip: 0, limit: 10 });
    if(optionsParseInfo.success === false) return optionsParseInfo;

    const { search, skip, limit } = optionsParseInfo.options;

    // filter
    const filter = searchByName__Filter(search);

    // Query:
    let result;
    try {
      result = await User.find(filter).skip(skip).limit(limit).select(getUserPublicInfo__Selector()).sort({ _id: -1 });
    }
    catch(err) {
      manageUnhandledServerError(err);
      return { success: false, error: UNEXPECTED_SERVER_ERROR.getWithCustomMessage("Could not get users") };
    };

    if(result.length === 0) return { success: false, error: USER_NOT_FOUND.getWithCustomMessage(skip > 0 ? "No more users were found" : "No user was found"), data: result };
  
    return { success: true, data: result };
  }
}


export const userInstanceMethods = {
  addInvitation: async function (invitation_id) {
    let result;
    try {
      result = await User.updateOne(
        { _id: this._id},
        {
          $push: {
            invitations: {
              $each: [{ _id: invitation_id, date: new Date() }],
              $position: 0
            }
          }
        }
      )
    }
    catch(err) {
      manageUnhandledServerError(err);
      return {
        success: false,
        error: UNEXPECTED_SERVER_ERROR.getWithCustomMessage("Could not push invitation to the user")
      }
    };

    if(result.matchedCount === 0) {
      return {
        success: false,
        error: USER_NOT_FOUND
      }
    };

    if(result.modifiedCount === 0) {
      return {
        success: false,
        error: UNEXPECTED_SERVER_ERROR.getWithCustomMessage("Could not push invitation to the user")
      }
    };


    return {
      sucess: true
    }

  },
}
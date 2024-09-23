import { UNVALID_PAYLOAD_DATA } from "../../errors/index.js";

const optionsValidators = {
  start: function (start) {
    try {
      start = this.skip(start);
    }
    catch(err) {
      throw err.replace(/skip/, "start")
    };
    return start;
  },
  skip: function (skip) {
    skip = parseInt(skip);
    if(Number.isSafeInteger(skip) === false) {
      throw "skip must be a parsable safe integer";
    }
    else if(skip < 0) {
      throw "skip must be positive"
    } 
    return skip;
  },
  end: function (end) {
    try {
      end = this.skip(end);
    }
    catch(err) {
      throw err.replace(/limit/, "end")
    };
    return end;
  },
  limit: function (limit) {
    limit = parseInt(limit);
    if(Number.isSafeInteger(limit) === false) {
      throw "limit must be a parsable safe integer";
    }
    else if(limit < 1) {
      throw "limit must be at least 1"
    };
    return limit;
  },
  type: function (type) {
    if(typeof type !== "string") {
      throw "type must be a valid string";
    }
    return type;
  },
  recent: function (recent) {
    if(recent === "true") return true;
    else if(recent === "false") return false;
    else if(typeof recent === "boolean") return recent;
    else return Boolean(recent);
  },
  closest: function (closest) {
    if(closest === "true") return true;
    else if(closest === "false") return false;
    else if(typeof closest === "boolean") return closest;
    else return Boolean(closest);
  },
  subscribed: function (subscribed) {
    if(subscribed === "true") return true;
    else if(subscribed === "false") return false;
    else if(typeof subscribed === "boolean") return subscribed;
    else return Boolean(subscribed);
  },
  created: function (created) {
    if(created === "true") return true;
    else if(created === "false") return false;
    else if(typeof created === "boolean") return created;
    else return Boolean(created);
  },
  search: function (search) {
    if(search != undefined && typeof search !== "string") throw "search must be a string or undefined";
    return search;
  }
};

export function parseAndValidateOptions(options, defaultOptions={}) {
  const fields = Object.keys(defaultOptions);
  const parsedOptions = {};
  let i = 0;
  try {
    while(i < fields.length) {
      let key = fields[i];
      let value = options[key] == undefined ? defaultOptions[key] : options[key];
      
      if(key === "limit") {
        if(value > defaultOptions[key]) value = defaultOptions[key]; // avoid the user to be returned more documents than the default limit
      }

      parsedOptions[key] = optionsValidators[key](value);
      i++;
    };
  }
  catch(errString) {
    return { success: false, error: UNVALID_PAYLOAD_DATA.getWithCustomMessage(`Options error: ${errString}`) };
  };

  return { success: true, options: parsedOptions };
}
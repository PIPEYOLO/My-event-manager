
export class StandardError {

  constructor({ status, code, message, extensionOf }) {
    if(StandardError.#classIsBlocked === true && extensionOf instanceof StandardError === false) throw new Error(`this class can only be used in its file or should be provided an extension object which must be an instance of this class`);

    if(Number.isSafeInteger(status) === false) throw new Error(`status must be a number`);
    if(typeof code !== "string") throw new Error(`code must be a string`);
    if(typeof message !== "string") throw new Error(`message must be a string`);

    this.status = status;
    this.code = code;
    this.message = message;


    Object.freeze(this);
  }

  static #classIsBlocked = false

  static blockClass() {
    this.#classIsBlocked = true;
  }

  getWithCustomMessage(message) {
    return new StandardError({...this, message, extensionOf: this });
  }

}


// User:
export const USER_NOT_FOUND = new StandardError({ status: 404, code: "USER_NOT_FOUND", message: "That user does not exist" });


// Login User:
export const INCORRECT_PASSWORD = new StandardError({ status: 403, code: "INCORRECT_PASSWORD", message: "Password is incorrect" });


// Register User:
export const UNAUTHORIZED = new StandardError({ status: 401, code: "UNAUTHORIZED", message: "You are unauthorized to access this resource" });
export const USER_REGISTER_INFO_IS_UNVALID = new StandardError({ status: 400, code: "USER_REGISTER_INFO_IS_UNVALID", message: "" });
export const FAILED_TO_CREATE_USER = new StandardError({ status: 500, code: "FAILED_TO_CREATE_USER", message: "Failed to register" });


// Authentication:
export const AUTHENTICATION_REQUIRED = new StandardError({ status: 401, code: "AUTHENTICATION_REQUIRED", message: "user needs to login to request this route with this method"});
export const UNVALID_AUTHENTICATION_CREDENTIALS = new StandardError({ status: 403, code: "UNVALID_AUTHENTICATION_CREDENTIALS", message: "user authentication credentials are unvalid"});


// Event:
export const EVENT_NOT_FOUND = new StandardError({ status: 404, code: "EVENT_NOT_FOUND", message: "That event does not exist or you do not have permissions to access it" });
export const USER_IS_ALREADY_JOINED_TO_EVENT = new StandardError({ status: 400, code: "USER_IS_ALREADY_JOINED_TO_EVENT", message: "User is already joined to that event" });
export const USER_IS_NOT_JOINED_TO_EVENT = new StandardError({ status: 400, code: "USER_IS_NOT_JOINED_TO_EVENT", message: "User is not joined to that event" });
export const USER_IS_NOT_ALLOWED_TO_EDIT_EVENT = new StandardError({ status: 401, code: "USER_IS_NOT_ALLOWED_TO_EDIT_EVENT", message: "User is not joined to that event" });
export const SUBSCRIBED_USER_NOT_FOUND = new StandardError({ status: 404, code: "SUBSCRIBED_USER_NOT_FOUND", message: "No subscribed user was found" });

// Invitation:
export const INVITATION_NOT_FOUND = new StandardError({ status: 404, code: "INVITATION_NOT_FOUND", message: "That invitation does not exist or you do not have permissions to access it"});

// Files:
export const FILE_NOT_FOUND = new StandardError({ status: 404, code: "FILE_NOT_FOUND", message: "Could not find that file"});



// Unexepected Errors:
export const UNEXPECTED_SERVER_ERROR = new StandardError({ status: 500, code: "UNEXPECTED_SERVER_ERROR", message: "Unexpected server error"});
export const UNEXPECTED_RENDER_ERROR = new StandardError({ status: 500, code: "UNEXPECTED_RENDER_ERROR", message: "Unexpected server error during the render"});


// Actions: 
export const ACTION_WAS_NOT_IMPLEMENTED = new StandardError({ status: 501, code: "ACTION_WAS_NOT_IMPLEMENTED", message: "That action was not implemented"});

// Other
export const UNVALID_PAYLOAD_DATA = new StandardError({ status: 400, code: "UNVALID_PAYLOAD_DATA", message: "" });
export const TOO_MANY_REQUESTS = new StandardError({ status: 400, code: "TOO_MANY_REQUESTS", message: "You are requesting this resource too many times." });


StandardError.blockClass();

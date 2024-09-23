import { decipherToken, getTokenCookie, getUserAuthInfo, setUserAuthInfo } from "../../../services/cookie/auth/index.js";
import { AUTHENTICATION_REQUIRED, UNAUTHORIZED, UNVALID_AUTHENTICATION_CREDENTIALS } from "../../../services/errors/index.js";



export function authorizationRequired(options={ type: "strict"}) {
  const { type } = options;
  
  return (req, res, next) => {
    
    // Get the user auth info
    let userAuthInfo = getUserAuthInfo(req);

    // If it was not present we set it
    if(userAuthInfo === undefined) {
      const tokenCookie = getTokenCookie(req); // get the token
      const tokenValidation = decipherToken(tokenCookie); // validate the token
      // create auth info
      if(tokenValidation.success) {
        userAuthInfo = { isAuthorized: true, data: tokenValidation.data };
      }
      else {
        // if token was present when validating an it was unvalid, rebound request
        if(tokenCookie != undefined) {
          return res.status(UNVALID_AUTHENTICATION_CREDENTIALS.status).send({ success: false, error: UNVALID_AUTHENTICATION_CREDENTIALS });
        }
        else { // otherwise continue without problem
          userAuthInfo = { isAuthorized: false, data: null };
        }
      };
      // The auth iinfo
      setUserAuthInfo(req, userAuthInfo);
      // Set user auth info in the request
    };
    
    // Then we verify if the user is authorized to accesss this route
    if(userAuthInfo.isAuthorized === false && type === "strict") {
      return res.status(AUTHENTICATION_REQUIRED.status).send({ success: false, error: AUTHENTICATION_REQUIRED })
    }

    return next();
  }
}
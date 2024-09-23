import { TOO_MANY_REQUESTS } from "../../../services/errors/index.js";


export function rateLimitMessage(message) {
  return ({ 
    success: false, 
    error: message ? TOO_MANY_REQUESTS.getWithCustomMessage(message) : TOO_MANY_REQUESTS
  })
};
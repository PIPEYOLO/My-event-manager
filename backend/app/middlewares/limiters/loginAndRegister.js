import rateLimit from "express-rate-limit";
import { rateLimitMessage } from "./_utils.js";



export const loginAndRegisterLimiter = rateLimit({
  windowMs: 1000 * 5,
  limit: 3,
  message: rateLimitMessage(),
});

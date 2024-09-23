import rateLimit from "express-rate-limit";
import { rateLimitMessage } from "./_utils.js";


export const getHTMLRateLimiter = rateLimit({
  windowMs: 1000,
  limit: 2,
  message: rateLimitMessage()
});

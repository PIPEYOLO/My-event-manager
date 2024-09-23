import rateLimit from "express-rate-limit";
import { rateLimitMessage } from "./_utils.js";



export const getFileRateLimiter = rateLimit({
  windowMs: 20000,
  limit: 25,
  message: rateLimitMessage()
});
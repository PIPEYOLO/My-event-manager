import rateLimit from "express-rate-limit";
import { rateLimitMessage } from "./_utils.js";



export const getUsersRateLimiter = rateLimit({
  windowMs: 5000,
  limit: 3,
  message: rateLimitMessage()
});

export const getSpecificUserRateLimiter = rateLimit({
  windowMs: 3000,
  limit: 4,
  message: rateLimitMessage()
})


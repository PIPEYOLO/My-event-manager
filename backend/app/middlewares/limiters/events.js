import rateLimit from "express-rate-limit";
import { rateLimitMessage } from "./_utils.js";


export const getEventsRateLimiter = rateLimit({
  windowMs: 5000,
  limit: 3,
  message: rateLimitMessage()
});

export const getSpecificEventRateLimiter = rateLimit({
  windowMs: 3000,
  limit: 4,
  message: rateLimitMessage()
})

export const eventCreationAndEditionRateLimiter = rateLimit({
  windowMs: 5000,
  limit: 1,
  message: rateLimitMessage()
});


export const eventPhotoChangeRateLimiter = rateLimit({
  windowMs: 5000,
  limit: 1,
  message: rateLimitMessage()
})

export const eventActionRateLimiter = rateLimit({
  windowMs: 1000,
  limit: 2,
  message: rateLimitMessage()
});


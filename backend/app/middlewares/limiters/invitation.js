import rateLimit from "express-rate-limit";
import { rateLimitMessage } from "./_utils.js";



export const getInvitationsRateLimiter = rateLimit({
  windowMs: 5000,
  limit: 3,
  message: rateLimitMessage()
});

export const getSpecificInvitationRateLimiter = rateLimit({
  windowMs: 3000,
  limit: 4,
  message: rateLimitMessage()
})

export const invitationCreationRateLimiter = rateLimit({
  windowMs: 5000,
  limit: 1,
  message: rateLimitMessage()
})


export const invitationManagementRateLimiter = rateLimit({
  windowMs: 1000,
  limit: 2,
  message: rateLimitMessage()
})

export const invitationDeletionRateLimiter = rateLimit({
  windowMs: 5000,
  limit: 1,
  message: rateLimitMessage()
})




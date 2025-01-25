import rateLimit from "express-rate-limit";

// Limit requests to 100 per 15 minutes per IP.
const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 100, // 15 minutes limit.
  max: 15, // Allow 100 requests per IP address.
  message: "too many requests, please try again after 15 minutes",
  headers: true // include rate-limit headers in the response
});

export default globalRateLimiter;
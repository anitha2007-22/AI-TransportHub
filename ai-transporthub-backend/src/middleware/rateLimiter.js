/**
 * rateLimiter.js — Express rate limiting to protect API endpoints
 */
const rateLimit = require("express-rate-limit");

// General API — 200 requests per 15 min per IP
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests — please try again in 15 minutes" },
});

// Auth endpoints — 10 attempts per 15 min (brute-force protection)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: "Too many login attempts — please try again later" },
});

// AI endpoints — 30 per hour (Claude API cost control)
const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30,
  message: { success: false, message: "AI request limit reached — try again in an hour" },
});

module.exports = { apiLimiter, authLimiter, aiLimiter };

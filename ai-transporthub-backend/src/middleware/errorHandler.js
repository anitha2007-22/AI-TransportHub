/**
 * errorHandler.js — Global Express error handler
 * Converts Mongoose and JWT errors to clean JSON responses
 */
const logger = require("../config/logger");

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message    = err.message    || "Internal server error";

  // Mongoose: duplicate key (e.g. email already registered)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    message    = `${field.charAt(0).toUpperCase() + field.slice(1)} already in use`;
    statusCode = 409;
  }

  // Mongoose: validation error
  if (err.name === "ValidationError") {
    message    = Object.values(err.errors).map((e) => e.message).join(". ");
    statusCode = 400;
  }

  // Mongoose: bad ObjectId
  if (err.name === "CastError") {
    message    = `Invalid ${err.path}: ${err.value}`;
    statusCode = 400;
  }

  // JWT errors
  if (err.name === "JsonWebTokenError")  { message = "Invalid token";  statusCode = 401; }
  if (err.name === "TokenExpiredError")  { message = "Token expired";  statusCode = 401; }

  if (statusCode >= 500) logger.error(err);

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

// Convenience: create an error with a status code
const createError = (message, statusCode = 500) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

module.exports = { errorHandler, createError };

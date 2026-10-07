/**
 * server.js — AI TransportHub Backend
 * Express + MongoDB REST API
 *
 * Start:  node src/server.js
 * Dev:    nodemon src/server.js
 */
require("dotenv").config();

const express      = require("express");
const cors         = require("cors");
const helmet       = require("helmet");
const morgan       = require("morgan");
const compression  = require("compression");

const connectDB    = require("./config/db");
const logger       = require("./config/logger");
const { apiLimiter }             = require("./middleware/rateLimiter");
const { errorHandler }           = require("./middleware/errorHandler");

// ── Route imports ─────────────────────────────────────────────────────────────
const authRoutes         = require("./routes/authRoutes");
const tripRoutes         = require("./routes/tripRoutes");
const reportRoutes       = require("./routes/reportRoutes");
const aiRoutes           = require("./routes/aiRoutes");
const { notificationRouter } = require("./routes/aiRoutes");
const { adminRouter }    = require("./routes/aiRoutes");

// ── Connect to MongoDB ────────────────────────────────────────────────────────
connectDB();

// ── App setup ─────────────────────────────────────────────────────────────────
const app = express();

// Security headers
app.use(helmet());

// CORS — allow frontend origin
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || "http://localhost:5173",
    "http://localhost:3000",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// Compression for responses
app.use(compression());

// HTTP request logging
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev", {
  stream: { write: (msg) => logger.info(msg.trim()) },
}));

// Body parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Global rate limiter
app.use("/api", apiLimiter);

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({
    status:      "ok",
    service:     "AI TransportHub API",
    version:     "1.0.0",
    environment: process.env.NODE_ENV || "development",
    timestamp:   new Date().toISOString(),
  });
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use("/api/auth",          authRoutes);
app.use("/api/trips",         tripRoutes);
app.use("/api/reports",       reportRoutes);
app.use("/api/ai",            aiRoutes);
app.use("/api/notifications", notificationRouter);
app.use("/api/admin",         adminRouter);

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ── Global error handler ──────────────────────────────────────────────────────
app.use(errorHandler);

// ── Start server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  logger.info(`🚀 AI TransportHub API running on port ${PORT} [${process.env.NODE_ENV || "development"}]`);
});

// Graceful shutdown
const shutdown = (signal) => {
  logger.info(`${signal} received — shutting down gracefully`);
  server.close(() => {
    logger.info("HTTP server closed");
    process.exit(0);
  });
};
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT",  () => shutdown("SIGINT"));

// Unhandled rejections
process.on("unhandledRejection", (err) => {
  logger.error(`Unhandled rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = app; // for testing

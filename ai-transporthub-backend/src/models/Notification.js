/**
 * Notification.js — In-app & push notifications for users
 */
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    // null = broadcast to all users
    isGlobal: { type: Boolean, default: false },

    category: {
      type: String,
      enum: ["alert", "weather", "transit", "eco", "ai", "system"],
      required: true,
    },
    priority: {
      type: String,
      enum: ["critical", "high", "medium", "low"],
      default: "medium",
    },

    icon:    String,
    title:   { type: String, required: true },
    body:    { type: String, required: true },

    read:    { type: Boolean, default: false },
    readAt:  Date,

    // Deep-link for mobile
    action:  { type: String },   // e.g. "/traffic" or "/planner"

    // If linked to a report or trip
    relatedReport: { type: mongoose.Schema.Types.ObjectId, ref: "Report" },
    relatedTrip:   { type: mongoose.Schema.Types.ObjectId, ref: "Trip" },

    // Push delivery tracking
    pushSent:      { type: Boolean, default: false },
    pushSentAt:    Date,

    expiresAt:     Date,
  },
  { timestamps: true }
);

notificationSchema.index({ user: 1, read: 1, createdAt: -1 });

module.exports = mongoose.model("Notification", notificationSchema);

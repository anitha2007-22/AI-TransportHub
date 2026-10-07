/**
 * TrafficIncident.js — Real-time traffic incidents (authority-managed)
 */
const mongoose = require("mongoose");

const trafficIncidentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["accident", "road_work", "waterlogging", "signal_down",
             "event_diversion", "breakdown", "other"],
      required: true,
    },
    severity: {
      type: String,
      enum: ["critical", "high", "medium", "low"],
      default: "medium",
    },

    location:  { type: String, required: true },
    coords:    { lat: Number, lng: Number },

    description: String,

    active:    { type: Boolean, default: true },

    // Expected resolution time
    estimatedClearAt: Date,
    clearedAt:        Date,

    // Source: citizen report, authority, or external API
    source: {
      type: String,
      enum: ["citizen_report", "authority", "google_maps", "tn_govt_feed"],
      default: "authority",
    },
    relatedReport: { type: mongoose.Schema.Types.ObjectId, ref: "Report" },

    affectedRoutes: [String],
    delayMinutes:   Number,
  },
  { timestamps: true }
);

trafficIncidentSchema.index({ active: 1, createdAt: -1 });
trafficIncidentSchema.index({ coords: "2dsphere" });

module.exports = mongoose.model("TrafficIncident", trafficIncidentSchema);

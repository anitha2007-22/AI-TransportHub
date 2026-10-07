/**
 * Trip.js — Records each journey a commuter plans or completes
 */
const mongoose = require("mongoose");

const stepSchema = new mongoose.Schema({
  mode:     { type: String, enum: ["walk", "metro", "bus", "cab", "cycle", "bike", "auto", "car"] },
  icon:     String,
  desc:     String,
  duration: String,
});

const tripSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    from:        { type: String, required: true },
    to:          { type: String, required: true },
    fromCoords:  { lat: Number, lng: Number },
    toCoords:    { lat: Number, lng: Number },

    departureTime: Date,
    arrivalTime:   Date,

    selectedRoute: {
      type: String,
      enum: ["fastest", "cheapest", "eco", "safest"],
      default: "fastest",
    },

    // AI-computed values
    durationMinutes: Number,
    distanceKm:      Number,
    costRupees:      Number,
    co2Kg:           Number,     // actual emission
    co2SavedKg:      Number,     // vs solo car baseline
    moneySavedRupees: Number,
    fuelSavedLitres:  Number,
    aiScore:          Number,    // 0–100 route quality score

    steps:   [stepSchema],

    status: {
      type: String,
      enum: ["planned", "completed", "cancelled"],
      default: "planned",
    },

    preferences: [String],       // e.g. ["Avoid tolls"]
    weatherAtDeparture: String,
  },
  { timestamps: true }
);

// Index for dashboard queries
tripSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("Trip", tripSchema);

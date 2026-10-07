/**
 * Report.js — Citizen-submitted road/traffic issue reports
 */
const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["accident", "road_damage", "waterlogging", "signal_issue",
             "traffic_jam", "broken_light", "bus_breakdown", "other"],
      required: true,
    },

    location:     { type: String, required: true },
    coords:       { lat: Number, lng: Number },

    priority: {
      type: String,
      enum: ["critical", "high", "medium", "low"],
      default: "medium",
    },

    description:  String,

    imageUrl:     String,   // Cloudinary URL after upload
    imagePublicId: String,  // Cloudinary public_id for deletion

    status: {
      type: String,
      enum: ["pending", "acknowledged", "investigating", "resolved"],
      default: "pending",
    },

    // Community upvotes — stores user IDs to prevent duplicate votes
    upvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // Authority response
    authorityNote:    String,
    resolvedAt:       Date,
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // AI auto-analysis
    aiSeverityScore:  Number,   // 0–100 from Claude analysis
    affectsRoutes:    [String], // route IDs impacted
  },
  { timestamps: true }
);

reportSchema.index({ coords: "2dsphere" });
reportSchema.index({ status: 1, createdAt: -1 });

// Virtual: upvote count
reportSchema.virtual("votes").get(function () {
  return this.upvotedBy.length;
});

reportSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Report", reportSchema);

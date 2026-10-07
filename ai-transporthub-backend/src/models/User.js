/**
 * User.js — Mongoose schema for all user roles
 * Roles: commuter | authority | admin
 */
const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [80, "Name cannot exceed 80 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // never return password in queries
    },
    role: {
      type: String,
      enum: ["commuter", "authority", "admin"],
      default: "commuter",
    },
    city: {
      type: String,
      default: "Chennai",
    },
    avatar: String,                // initials or Cloudinary URL
    fcmToken: String,              // Firebase Cloud Messaging token for push

    // Commuter-specific
    ecoScore:       { type: Number, default: 0, min: 0, max: 100 },
    totalCo2Saved:  { type: Number, default: 0 },         // kg
    totalTripsMade: { type: Number, default: 0 },
    favouriteRoutes: [
      {
        from:  String,
        to:    String,
        label: String,
      },
    ],

    // Auth
    isEmailVerified:     { type: Boolean, default: false },
    emailVerifyToken:    String,
    emailVerifyExpires:  Date,
    passwordResetToken:  String,
    passwordResetExpires: Date,
    refreshToken:        String,

    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
    lastLogin: Date,
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare plain password to hashed
userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Auto-generate avatar initials from name
userSchema.pre("save", function (next) {
  if (!this.avatar && this.name) {
    this.avatar = this.name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  next();
});

module.exports = mongoose.model("User", userSchema);

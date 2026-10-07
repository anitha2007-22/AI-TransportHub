/**
 * authController.js — Registration, Login, Email Verify, Password Reset
 * All routes: POST /api/auth/*
 */
const crypto     = require("crypto");
const jwt        = require("jsonwebtoken");
const User       = require("../models/User");
const { sendVerificationEmail, sendPasswordResetEmail } = require("../services/emailService");
const { createError } = require("../middleware/errorHandler");
const logger     = require("../config/logger");

// ── Helpers ──────────────────────────────────────────────────────────────────

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

const signRefreshToken = (id) =>
  jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d" });

const sendTokens = (res, user, statusCode = 200) => {
  const token        = signToken(user._id);
  const refreshToken = signRefreshToken(user._id);

  const { password, passwordResetToken, emailVerifyToken, refreshToken: _, ...safeUser } = user.toObject();

  res.status(statusCode).json({
    success: true,
    token,
    refreshToken,
    user: safeUser,
  });
};

// ── Controllers ──────────────────────────────────────────────────────────────

/**
 * POST /api/auth/register
 */
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, city } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return next(createError("Email already registered", 409));

    // Only allow commuter and authority self-registration; admin must be seeded
    const allowedRole = ["commuter", "authority"].includes(role) ? role : "commuter";

    const verifyToken   = crypto.randomBytes(32).toString("hex");
    const verifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    const user = await User.create({
      name,
      email,
      password,
      role: allowedRole,
      city: city || "Chennai",
      emailVerifyToken:   crypto.createHash("sha256").update(verifyToken).digest("hex"),
      emailVerifyExpires: verifyExpires,
    });

    // Send verification email (non-blocking — don't fail registration on email error)
    sendVerificationEmail(email, name, verifyToken).catch((err) =>
      logger.warn(`Verification email failed: ${err.message}`)
    );

    logger.info(`New user registered: ${email} (${allowedRole})`);
    sendTokens(res, user, 201);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/login
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return next(createError("Email and password are required", 400));

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return next(createError("Invalid email or password", 401));
    }
    if (user.status === "suspended") {
      return next(createError("Account suspended — please contact support", 403));
    }

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    logger.info(`Login: ${email}`);
    sendTokens(res, user);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/auth/me   (protected)
 */
exports.getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

/**
 * POST /api/auth/refresh-token
 */
exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return next(createError("Refresh token required", 400));

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user    = await User.findById(decoded.id);
    if (!user) return next(createError("User not found", 404));

    const token = signToken(user._id);
    res.json({ success: true, token });
  } catch {
    next(createError("Invalid or expired refresh token", 401));
  }
};

/**
 * POST /api/auth/verify-email
 */
exports.verifyEmail = async (req, res, next) => {
  try {
    const hashed = crypto.createHash("sha256").update(req.body.token || "").digest("hex");
    const user   = await User.findOne({
      emailVerifyToken:   hashed,
      emailVerifyExpires: { $gt: Date.now() },
    });
    if (!user) return next(createError("Invalid or expired verification link", 400));

    user.isEmailVerified   = true;
    user.emailVerifyToken  = undefined;
    user.emailVerifyExpires = undefined;
    await user.save({ validateBeforeSave: false });

    res.json({ success: true, message: "Email verified successfully" });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/forgot-password
 */
exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      // Don't reveal whether email exists
      return res.json({ success: true, message: "If that email is registered, a reset link has been sent." });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken   = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1h
    await user.save({ validateBeforeSave: false });

    sendPasswordResetEmail(user.email, user.name, resetToken).catch((err) =>
      logger.warn(`Password reset email failed: ${err.message}`)
    );

    res.json({ success: true, message: "If that email is registered, a reset link has been sent." });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/reset-password
 */
exports.resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) return next(createError("Token and new password are required", 400));
    if (password.length < 6) return next(createError("Password must be at least 6 characters", 400));

    const hashed = crypto.createHash("sha256").update(token).digest("hex");
    const user   = await User.findOne({
      passwordResetToken:   hashed,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) return next(createError("Invalid or expired reset link", 400));

    user.password             = password;
    user.passwordResetToken   = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({ success: true, message: "Password reset successfully" });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/auth/update-password   (protected)
 */
exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select("+password");
    if (!(await user.comparePassword(currentPassword))) {
      return next(createError("Current password is incorrect", 401));
    }
    user.password = newPassword;
    await user.save();
    sendTokens(res, user);
  } catch (err) {
    next(err);
  }
};

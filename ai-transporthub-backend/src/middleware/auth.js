/**
 * auth.js — JWT authentication & role-based authorization middleware
 *
 * Usage:
 *   router.get("/protected", protect, route)
 *   router.delete("/admin-only", protect, authorize("admin"), route)
 *   router.get("/authority-or-admin", protect, authorize("authority", "admin"), route)
 */
const jwt    = require("jsonwebtoken");
const User   = require("../models/User");
const logger = require("../config/logger");

/**
 * protect — verifies Bearer JWT in Authorization header
 * Attaches the full user document to req.user
 */
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Not authenticated — no token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password -passwordResetToken -emailVerifyToken");
    if (!user) {
      return res.status(401).json({ success: false, message: "User no longer exists" });
    }
    if (user.status === "suspended") {
      return res.status(403).json({ success: false, message: "Account suspended — contact support" });
    }

    req.user = user;
    next();
  } catch (err) {
    logger.warn(`Auth failed: ${err.message}`);
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token expired — please log in again" });
    }
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

/**
 * authorize(...roles) — restrict access to specific roles
 * Call AFTER protect()
 */
const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: `Access denied — requires role: ${roles.join(" or ")}`,
    });
  }
  next();
};

module.exports = { protect, authorize };

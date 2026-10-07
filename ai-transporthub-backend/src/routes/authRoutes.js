/**
 * authRoutes.js — /api/auth
 */
const router     = require("express").Router();
const ctrl       = require("../controllers/authController");
const { protect }           = require("../middleware/auth");
const { authLimiter }       = require("../middleware/rateLimiter");
const { body, validationResult } = require("express-validator");

// Input validation middleware
const validateRegister = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
];

router.post("/register",         validateRegister, ctrl.register);
router.post("/login",            authLimiter, ctrl.login);
router.post("/refresh-token",    ctrl.refreshToken);
router.post("/verify-email",     ctrl.verifyEmail);
router.post("/forgot-password",  authLimiter, ctrl.forgotPassword);
router.post("/reset-password",   ctrl.resetPassword);

// Protected
router.get ("/me",               protect, ctrl.getMe);
router.put ("/update-password",  protect, ctrl.updatePassword);

module.exports = router;

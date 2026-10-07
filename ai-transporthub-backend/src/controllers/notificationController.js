/**
 * notificationController.js — In-app notification management
 * Routes: /api/notifications
 */
const Notification = require("../models/Notification");
const { createError } = require("../middleware/errorHandler");

/**
 * GET /api/notifications
 * User's notifications (personal + global broadcasts), newest first
 */
exports.getNotifications = async (req, res, next) => {
  try {
    const { page = 1, limit = 30, category, unreadOnly } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const filter = {
      $or: [{ user: req.user._id }, { isGlobal: true }],
      ...(category && category !== "all" ? { category } : {}),
      ...(unreadOnly === "true" ? { read: false } : {}),
      $or: [{ expiresAt: { $gt: new Date() } }, { expiresAt: null }],
    };

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Notification.countDocuments(filter),
      Notification.countDocuments({
        $or: [{ user: req.user._id }, { isGlobal: true }],
        read: false,
      }),
    ]);

    res.json({ success: true, total, unreadCount, page: Number(page), notifications });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/notifications/:id/read
 */
exports.markRead = async (req, res, next) => {
  try {
    const notif = await Notification.findOneAndUpdate(
      { _id: req.params.id, $or: [{ user: req.user._id }, { isGlobal: true }] },
      { read: true, readAt: new Date() },
      { new: true }
    );
    if (!notif) return next(createError("Notification not found", 404));
    res.json({ success: true, notification: notif });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/notifications/mark-all-read
 */
exports.markAllRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { $or: [{ user: req.user._id }, { isGlobal: true }], read: false },
      { read: true, readAt: new Date() }
    );
    res.json({ success: true, message: "All notifications marked as read" });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/notifications/:id
 */
exports.deleteNotification = async (req, res, next) => {
  try {
    await Notification.findOneAndDelete({
      _id: req.params.id,
      $or: [{ user: req.user._id }, { isGlobal: true }],
    });
    res.json({ success: true, message: "Notification dismissed" });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/notifications
 * Clear all user notifications
 */
exports.clearAll = async (req, res, next) => {
  try {
    await Notification.deleteMany({ user: req.user._id });
    res.json({ success: true, message: "All notifications cleared" });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/notifications/broadcast   (admin only)
 * Send a notification to all users
 */
exports.broadcast = async (req, res, next) => {
  try {
    const { category, priority, icon, title, body, action } = req.body;
    if (!title || !body) return next(createError("Title and body are required", 400));

    const notif = await Notification.create({
      isGlobal: true,
      category: category || "system",
      priority: priority || "medium",
      icon:     icon || "📢",
      title,
      body,
      action,
    });

    res.status(201).json({ success: true, notification: notif });
  } catch (err) {
    next(err);
  }
};

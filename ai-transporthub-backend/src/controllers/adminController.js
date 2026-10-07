/**
 * adminController.js — Admin-only endpoints
 * Routes: /api/admin
 */
const User             = require("../models/User");
const Trip             = require("../models/Trip");
const Report           = require("../models/Report");
const TrafficIncident  = require("../models/TrafficIncident");
const { createError }  = require("../middleware/errorHandler");
const { broadcastNotification } = require("../services/notificationService");

/**
 * GET /api/admin/users
 * Paginated user list with search and role filter
 */
exports.getUsers = async (req, res, next) => {
  try {
    const { search, role, status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (role)   filter.role   = role;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { name:  { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      User.countDocuments(filter),
    ]);

    res.json({ success: true, total, page: Number(page), users });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/admin/users/:id
 * Update role or status
 */
exports.updateUser = async (req, res, next) => {
  try {
    const { role, status } = req.body;
    const allowed = {};
    if (role)   allowed.role   = role;
    if (status) allowed.status = status;

    const user = await User.findByIdAndUpdate(req.params.id, allowed, { new: true });
    if (!user) return next(createError("User not found", 404));

    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/admin/users/:id
 */
exports.deleteUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return next(createError("Cannot delete your own account", 400));
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return next(createError("User not found", 404));
    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/analytics
 * City-wide aggregated statistics for authority/admin dashboard
 */
exports.getAnalytics = async (req, res, next) => {
  try {
    const today     = new Date(); today.setHours(0, 0, 0, 0);
    const thisWeek  = new Date(Date.now() - 7  * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      totalTripsToday,
      activeIncidents,
      pendingReports,
      resolvedToday,
      co2SavedWeekly,
    ] = await Promise.all([
      User.countDocuments({ role: "commuter" }),
      Trip.countDocuments({ createdAt: { $gte: today } }),
      TrafficIncident.countDocuments({ active: true }),
      Report.countDocuments({ status: { $in: ["pending", "acknowledged", "investigating"] } }),
      Report.countDocuments({ status: "resolved", updatedAt: { $gte: today } }),
      Trip.aggregate([
        { $match: { createdAt: { $gte: thisWeek }, status: "completed" } },
        { $group: { _id: null, total: { $sum: "$co2SavedKg" } } },
      ]),
    ]);

    // Popular routes — top 6 from/to pairs this week
    const popularRoutes = await Trip.aggregate([
      { $match: { createdAt: { $gte: thisWeek } } },
      { $group: { _id: { from: "$from", to: "$to" }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 },
    ]);

    res.json({
      success: true,
      analytics: {
        totalUsers,
        totalTripsToday,
        activeIncidents,
        pendingReports,
        resolvedToday,
        co2SavedWeeklyKg: co2SavedWeekly[0]?.total?.toFixed(1) || 0,
        popularRoutes: popularRoutes.map(r => ({
          route:  `${r._id.from} → ${r._id.to}`,
          trips:  r.count,
        })),
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/traffic-incidents
 * List all traffic incidents
 */
exports.getIncidents = async (req, res, next) => {
  try {
    const { active } = req.query;
    const filter = {};
    if (active !== undefined) filter.active = active === "true";
    const incidents = await TrafficIncident.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: incidents.length, incidents });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/admin/traffic-incidents
 * Authority creates a new incident
 */
exports.createIncident = async (req, res, next) => {
  try {
    const incident = await TrafficIncident.create({
      ...req.body,
      source: "authority",
    });
    res.status(201).json({ success: true, incident });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/admin/traffic-incidents/:id/clear
 * Mark incident as resolved
 */
exports.clearIncident = async (req, res, next) => {
  try {
    const incident = await TrafficIncident.findByIdAndUpdate(
      req.params.id,
      { active: false, clearedAt: new Date() },
      { new: true }
    );
    if (!incident) return next(createError("Incident not found", 404));
    res.json({ success: true, incident });
  } catch (err) {
    next(err);
  }
};

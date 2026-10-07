/**
 * reportController.js — Citizen issue reports CRUD + image upload
 * Routes: /api/reports
 */
const Report                       = require("../models/Report");
const { uploadToCloudinary }       = require("../middleware/upload");
const { analyseReportSeverity }    = require("../services/aiService");
const { notifyUser,
        createNotification }       = require("../services/notificationService");
const { sendReportUpdateEmail }    = require("../services/emailService");
const User                         = require("../models/User");
const { createError }              = require("../middleware/errorHandler");
const logger                       = require("../config/logger");

/**
 * POST /api/reports
 * Submit a new citizen report (with optional image)
 */
exports.createReport = async (req, res, next) => {
  try {
    const { type, location, priority, description, lat, lng } = req.body;
    if (!type || !location) return next(createError("Type and location are required", 400));

    let imageUrl, imagePublicId;

    // Upload image to Cloudinary if provided
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl      = result.url;
      imagePublicId = result.publicId;
    }

    // AI severity analysis (non-blocking fallback)
    let aiSeverityScore = 50;
    let suggestedPriority = priority || "medium";
    try {
      const analysis = await analyseReportSeverity(type, location, description);
      aiSeverityScore   = analysis.score;
      suggestedPriority = analysis.priority;
    } catch {
      logger.warn("AI severity analysis skipped");
    }

    const report = await Report.create({
      submittedBy:    req.user._id,
      type,
      location,
      coords:         lat && lng ? { lat: Number(lat), lng: Number(lng) } : undefined,
      priority:       priority || suggestedPriority,
      description,
      imageUrl,
      imagePublicId,
      aiSeverityScore,
    });

    // Notify authority users
    await createNotification({
      isGlobal: false,
      category: "alert",
      priority: report.priority,
      icon:     "🚨",
      title:    `New ${type.replace("_", " ")} report`,
      body:     `${location} — submitted by a citizen`,
      action:   "/reports",
      relatedReport: report._id,
    });

    logger.info(`Report created: ${report._id} (${type} at ${location})`);
    res.status(201).json({ success: true, report: await report.populate("submittedBy", "name email") });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/reports
 * Public list of recent reports (with optional filters)
 */
exports.getReports = async (req, res, next) => {
  try {
    const { status, type, priority, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status)   filter.status   = status;
    if (type)     filter.type     = type;
    if (priority) filter.priority = priority;

    const skip = (Number(page) - 1) * Number(limit);
    const [reports, total] = await Promise.all([
      Report.find(filter)
            .populate("submittedBy", "name avatar")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit)),
      Report.countDocuments(filter),
    ]);

    res.json({ success: true, total, page: Number(page), reports });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/reports/my
 * Authenticated user's own reports
 */
exports.getMyReports = async (req, res, next) => {
  try {
    const reports = await Report.find({ submittedBy: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: reports.length, reports });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/reports/:id
 */
exports.getReport = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id).populate("submittedBy", "name avatar");
    if (!report) return next(createError("Report not found", 404));
    res.json({ success: true, report });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/reports/:id/status
 * Authority/admin: update report status
 */
exports.updateStatus = async (req, res, next) => {
  try {
    const { status, authorityNote } = req.body;
    const validStatuses = ["pending", "acknowledged", "investigating", "resolved"];
    if (!validStatuses.includes(status)) return next(createError("Invalid status", 400));

    const report = await Report.findById(req.params.id).populate("submittedBy", "name email fcmToken");
    if (!report) return next(createError("Report not found", 404));

    report.status        = status;
    report.authorityNote = authorityNote || report.authorityNote;
    if (status === "resolved") {
      report.resolvedAt = new Date();
      report.resolvedBy = req.user._id;
    }
    await report.save();

    // Email the reporter
    if (report.submittedBy?.email) {
      sendReportUpdateEmail(
        report.submittedBy.email,
        report.submittedBy.name,
        report._id.toString().slice(-6).toUpperCase(),
        status
      ).catch(() => {});
    }

    // In-app notification to reporter
    await notifyUser(
      report.submittedBy._id,
      {
        category: "alert",
        priority: "medium",
        icon:     status === "resolved" ? "✅" : "🔄",
        title:    `Your report has been ${status}`,
        body:     authorityNote || `Authorities have ${status} your road report at ${report.location}.`,
        action:   "/reports",
        relatedReport: report._id,
      },
      report.submittedBy.fcmToken
    );

    res.json({ success: true, report });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/reports/:id/upvote
 * Community confirmation of a report
 */
exports.upvoteReport = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return next(createError("Report not found", 404));

    const userId = req.user._id.toString();
    if (report.upvotedBy.map(String).includes(userId)) {
      return next(createError("You have already upvoted this report", 400));
    }

    report.upvotedBy.push(req.user._id);
    await report.save();

    res.json({ success: true, votes: report.upvotedBy.length });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/reports/:id
 * Reporter or admin can delete
 */
exports.deleteReport = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return next(createError("Report not found", 404));

    const isOwner = report.submittedBy.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return next(createError("Not authorised to delete this report", 403));
    }

    await report.deleteOne();
    res.json({ success: true, message: "Report deleted" });
  } catch (err) {
    next(err);
  }
};

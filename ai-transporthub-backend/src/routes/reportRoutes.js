/**
 * reportRoutes.js — /api/reports
 */
const router = require("express").Router();
const ctrl   = require("../controllers/reportController");
const { protect, authorize } = require("../middleware/auth");
const { upload }             = require("../middleware/upload");

router.post  ("/",           protect, upload.single("image"), ctrl.createReport);
router.get   ("/",           ctrl.getReports);   // public
router.get   ("/my",         protect, ctrl.getMyReports);
router.get   ("/:id",        ctrl.getReport);    // public
router.put   ("/:id/status", protect, authorize("authority","admin"), ctrl.updateStatus);
router.post  ("/:id/upvote", protect, ctrl.upvoteReport);
router.delete("/:id",        protect, ctrl.deleteReport);

module.exports = router;

/**
 * tripRoutes.js — /api/trips
 */
const router = require("express").Router();
const ctrl   = require("../controllers/tripController");
const { protect } = require("../middleware/auth");

router.post  ("/plan",    protect, ctrl.planTrip);
router.post  ("/insight", protect, ctrl.getInsight);
router.get   ("/stats",   protect, ctrl.getMyStats);
router.get   ("/",        protect, ctrl.getMyTrips);
router.post  ("/",        protect, ctrl.saveTrip);
router.delete("/:id",     protect, ctrl.deleteTrip);

module.exports = router;

/**
 * tripController.js — Journey planning & trip history
 * Routes: /api/trips
 */
const Trip                           = require("../models/Trip");
const { generateRouteOptions }       = require("../services/routeService");
const { calculateTripCarbon,
        calculateEcoScore }          = require("../services/carbonService");
const { getRouteInsight }            = require("../services/aiService");
const User                           = require("../models/User");
const { createError }                = require("../middleware/errorHandler");

/**
 * POST /api/trips/plan
 * Generate AI route options — does NOT save to DB yet
 */
exports.planTrip = async (req, res, next) => {
  try {
    const { from, to, departureTime, preferences } = req.body;
    if (!from || !to) return next(createError("From and To locations are required", 400));

    const routes = await generateRouteOptions(
      from, to,
      departureTime || new Date().toISOString(),
      preferences || []
    );

    res.json({ success: true, count: routes.length, routes });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/trips/insight
 * Get Claude AI insight for a selected route
 */
exports.getInsight = async (req, res, next) => {
  try {
    const { from, to, time, selectedRoute } = req.body;
    const insight = await getRouteInsight(from, to, time, selectedRoute);
    res.json({ success: true, insight });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/trips
 * Save a completed or planned trip to DB
 */
exports.saveTrip = async (req, res, next) => {
  try {
    const { from, to, departureTime, arrivalTime, selectedRoute,
            durationMinutes, distanceKm, costRupees, mode, steps } = req.body;

    const carbon = calculateTripCarbon(mode || "metro", distanceKm || 0);

    const trip = await Trip.create({
      user:            req.user._id,
      from, to,
      departureTime,
      arrivalTime,
      selectedRoute,
      durationMinutes,
      distanceKm,
      costRupees,
      co2Kg:           carbon.co2Emitted,
      co2SavedKg:      carbon.co2Saved,
      moneySavedRupees: carbon.moneySaved,
      fuelSavedLitres: carbon.fuelSaved,
      steps: steps || [],
      status: arrivalTime ? "completed" : "planned",
    });

    // Update user's cumulative stats
    if (trip.status === "completed") {
      const recentTrips = await Trip.find({ user: req.user._id, status: "completed" }).limit(30);
      const newEcoScore = calculateEcoScore(recentTrips);

      await User.findByIdAndUpdate(req.user._id, {
        $inc: {
          totalTripsMade: 1,
          totalCo2Saved:  carbon.co2Saved,
        },
        ecoScore: newEcoScore,
      });
    }

    res.status(201).json({ success: true, trip });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/trips
 * User's trip history with pagination
 */
exports.getMyTrips = async (req, res, next) => {
  try {
    const page  = Math.max(1, Number(req.query.page)  || 1);
    const limit = Math.min(50, Number(req.query.limit) || 20);
    const skip  = (page - 1) * limit;

    const [trips, total] = await Promise.all([
      Trip.find({ user: req.user._id })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
      Trip.countDocuments({ user: req.user._id }),
    ]);

    res.json({
      success: true,
      count: trips.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      trips,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/trips/stats
 * Aggregated stats for carbon dashboard
 */
exports.getMyStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Weekly aggregation
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weeklyTrips  = await Trip.find({ user: userId, createdAt: { $gte: sevenDaysAgo } });

    const totalCo2Saved    = weeklyTrips.reduce((s, t) => s + (t.co2SavedKg || 0), 0);
    const totalMoneySaved  = weeklyTrips.reduce((s, t) => s + (t.moneySavedRupees || 0), 0);
    const totalFuelSaved   = weeklyTrips.reduce((s, t) => s + (t.fuelSavedLitres || 0), 0);
    const totalCo2Emitted  = weeklyTrips.reduce((s, t) => s + (t.co2Kg || 0), 0);

    // Mode share
    const modeCount = {};
    weeklyTrips.forEach(t => { modeCount[t.selectedRoute] = (modeCount[t.selectedRoute] || 0) + 1; });

    res.json({
      success: true,
      weekly: {
        trips:          weeklyTrips.length,
        co2Saved:       +totalCo2Saved.toFixed(2),
        co2Emitted:     +totalCo2Emitted.toFixed(2),
        moneySaved:     +totalMoneySaved.toFixed(0),
        fuelSaved:      +totalFuelSaved.toFixed(2),
        treesEquiv:     +(totalCo2Saved / 10.8).toFixed(2),
        modeShare:      modeCount,
      },
      allTime: {
        totalTrips:    req.user.totalTripsMade,
        totalCo2Saved: req.user.totalCo2Saved,
        ecoScore:      req.user.ecoScore,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/trips/:id
 */
exports.deleteTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, user: req.user._id });
    if (!trip) return next(createError("Trip not found", 404));
    await trip.deleteOne();
    res.json({ success: true, message: "Trip deleted" });
  } catch (err) {
    next(err);
  }
};

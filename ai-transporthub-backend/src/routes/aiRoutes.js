/**
 * aiRoutes.js — /api/ai  (voice is PUBLIC — no auth needed)
 */
const router = require("express").Router();
const ctrl   = require("../controllers/aiController");
const { protect }   = require("../middleware/auth");
const { aiLimiter } = require("../middleware/rateLimiter");

router.post("/route-insight",    protect, aiLimiter, ctrl.routeInsight);
router.post("/traffic-briefing", protect, aiLimiter, ctrl.trafficBriefing);
router.get ("/eco-tip",          protect, aiLimiter, ctrl.ecoTip);
router.post("/voice",            ctrl.voiceQuery); // PUBLIC — no JWT needed

// Test endpoint — verify Gemini key works
router.get("/test", async (req, res) => {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === "AIza-your-key-here") {
    return res.json({ ok: false, reason: "GEMINI_API_KEY not set in backend .env" });
  }
  try {
    const { GoogleGenerativeAI } = require("@google/generative-ai");
    const model  = new GoogleGenerativeAI(key).getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Say exactly: Gemini API works!");
    res.json({ ok: true, reply: result.response.text(), model: "gemini-1.5-flash" });
  } catch (err) {
    res.json({ ok: false, reason: err.message });
  }
});

module.exports = router;

// ── Notification routes ────────────────────────────────────────────────────────
const nRouter = require("express").Router();
const nCtrl   = require("../controllers/notificationController");
const { protect: nP, authorize: nA } = require("../middleware/auth");
nRouter.get   ("/",              nP, nCtrl.getNotifications);
nRouter.put   ("/mark-all-read", nP, nCtrl.markAllRead);
nRouter.delete("/",              nP, nCtrl.clearAll);
nRouter.put   ("/:id/read",      nP, nCtrl.markRead);
nRouter.delete("/:id",           nP, nCtrl.deleteNotification);
nRouter.post  ("/broadcast",     nP, nA("admin"), nCtrl.broadcast);
module.exports.notificationRouter = nRouter;

// ── Admin routes ───────────────────────────────────────────────────────────────
const aRouter = require("express").Router();
const aCtrl   = require("../controllers/adminController");
const { protect: aP, authorize: aA } = require("../middleware/auth");
const adminGuard = [aP, aA("admin", "authority")];
aRouter.get   ("/users",                       aP, aA("admin"), aCtrl.getUsers);
aRouter.put   ("/users/:id",                   aP, aA("admin"), aCtrl.updateUser);
aRouter.delete("/users/:id",                   aP, aA("admin"), aCtrl.deleteUser);
aRouter.get   ("/analytics",                   ...adminGuard,   aCtrl.getAnalytics);
aRouter.get   ("/traffic-incidents",           ...adminGuard,   aCtrl.getIncidents);
aRouter.post  ("/traffic-incidents",           ...adminGuard,   aCtrl.createIncident);
aRouter.put   ("/traffic-incidents/:id/clear", ...adminGuard,   aCtrl.clearIncident);
module.exports.adminRouter = aRouter;

/**
 * notificationService.js — Firebase Cloud Messaging push notifications
 * + in-app notification creation via MongoDB
 */
const admin        = require("firebase-admin");
const Notification = require("../models/Notification");
const logger       = require("../config/logger");

// Initialise Firebase Admin SDK once
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId:   process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey:  process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
    logger.info("Firebase Admin initialised");
  } catch (err) {
    logger.warn(`Firebase Admin init skipped: ${err.message}`);
  }
}

/**
 * createNotification — save an in-app notification to DB
 * @param {Object} data  { user?, isGlobal, category, priority, icon, title, body, action? }
 */
const createNotification = async (data) => {
  try {
    const notif = await Notification.create(data);
    return notif;
  } catch (err) {
    logger.error("Create notification error:", err);
  }
};

/**
 * sendPushNotification — send FCM push to a single device token
 */
const sendPushNotification = async (fcmToken, { title, body, data = {} }) => {
  if (!fcmToken || !admin.apps.length) return;
  try {
    const res = await admin.messaging().send({
      token: fcmToken,
      notification: { title, body },
      data,
      android: { priority: "high" },
      apns:    { payload: { aps: { sound: "default" } } },
    });
    logger.info(`Push sent: ${res}`);
    return res;
  } catch (err) {
    logger.warn(`Push send failed: ${err.message}`);
  }
};

/**
 * broadcastNotification — send to multiple FCM tokens (multicast)
 */
const broadcastNotification = async (fcmTokens, payload) => {
  if (!fcmTokens?.length || !admin.apps.length) return;
  try {
    const res = await admin.messaging().sendEachForMulticast({
      tokens: fcmTokens,
      notification: { title: payload.title, body: payload.body },
    });
    logger.info(`Broadcast: ${res.successCount} sent, ${res.failureCount} failed`);
    return res;
  } catch (err) {
    logger.warn(`Broadcast failed: ${err.message}`);
  }
};

/**
 * notifyUser — create in-app + optionally send push
 */
const notifyUser = async (userId, data, fcmToken = null) => {
  const notif = await createNotification({ user: userId, ...data });
  if (fcmToken) await sendPushNotification(fcmToken, { title: data.title, body: data.body });
  return notif;
};

module.exports = {
  createNotification,
  sendPushNotification,
  broadcastNotification,
  notifyUser,
};

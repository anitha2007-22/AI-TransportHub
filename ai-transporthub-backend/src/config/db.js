/**
 * db.js — MongoDB connection via Mongoose with auto-retry
 */
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ MongoDB error: ${err.message}`);
    setTimeout(connectDB, 5000); // retry after 5s
  }
};

module.exports = connectDB;

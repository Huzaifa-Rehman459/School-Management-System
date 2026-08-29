const mongoose = require("mongoose");

let cachedConnection = null;

async function connectDB() {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  cachedConnection = await mongoose.connect(
    process.env.MONGO_URI || "mongodb://127.0.0.1:27017/bright_future_school"
  );

  console.log(`MongoDB connected: ${mongoose.connection.name}`);
  return cachedConnection;
}

module.exports = connectDB;
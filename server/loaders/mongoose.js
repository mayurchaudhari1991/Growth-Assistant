const mongoose = require("mongoose");
const env = require("../lib/config/env");

async function connectMongoDB() {
  try {
    await mongoose.connect(env.mongodb.uri);
    console.log("[MongoDB] Connected successfully");
  } catch (error) {
    console.error("[MongoDB] Connection failed:", error.message);
    process.exit(1);
  }

  mongoose.connection.on("disconnected", () => {
    console.warn("[MongoDB] Disconnected");
  });

  mongoose.connection.on("error", (err) => {
    console.error("[MongoDB] Error:", err.message);
  });
}

module.exports = { connectMongoDB };

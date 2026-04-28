const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ["morning", "afternoon", "evening"],
    unique: true,
  },
  label: {
    type: String,
    required: true,
  },
  startTime: {
    type: Number, // Hour (0-23)
    required: true,
  },
  endTime: {
    type: Number, // Hour (0-23)
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Schedule", scheduleSchema);

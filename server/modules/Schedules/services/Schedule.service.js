const Schedule = require("../models/Schedule.model");

class ScheduleService {
  async getSchedules() {
    let schedules = await Schedule.find().sort({ startTime: 1 });
    
    // Seed default schedules if none exist
    if (schedules.length === 0) {
      schedules = await Schedule.insertMany([
        { name: "morning", label: "Morning Peak", startTime: 8, endTime: 11, isActive: true },
        { name: "afternoon", label: "Afternoon Wave", startTime: 13, endTime: 16, isActive: true },
        { name: "evening", label: "Evening Engagement", startTime: 19, endTime: 22, isActive: true },
      ]);
    }
    
    return schedules;
  }

  async updateSchedule(id, data) {
    const schedule = await Schedule.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );
    if (!schedule) {
      const err = new Error("Schedule not found");
      err.status = 404;
      throw err;
    }
    return schedule;
  }
}

module.exports = new ScheduleService();

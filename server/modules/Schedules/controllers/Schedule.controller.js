const ScheduleService = require("../services/Schedule.service");

async function getSchedules(req, res, next) {
  try {
    const schedules = await ScheduleService.getSchedules();
    res.json({ success: true, schedules });
  } catch (err) {
    next(err);
  }
}

async function updateSchedule(req, res, next) {
  try {
    const schedule = await ScheduleService.updateSchedule(req.params.id, req.body);
    res.json({ success: true, schedule });
  } catch (err) {
    next(err);
  }
}

module.exports = { getSchedules, updateSchedule };

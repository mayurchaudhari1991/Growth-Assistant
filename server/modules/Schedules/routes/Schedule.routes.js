const express = require("express");
const router = express.Router();
const { getSchedules, updateSchedule } = require("../controllers/Schedule.controller");

router.get("/", getSchedules);
router.put("/:id", updateSchedule);

module.exports = router;

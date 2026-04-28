const express = require("express");
const cors = require("cors");
const { errorHandler } = require("../middleware");

const postRoutes = require("../modules/Posts/routes/Post.routes");
const newsRoutes = require("../modules/News/routes/News.routes");
const aiRoutes = require("../modules/AI/routes/AI.routes");
const imageRoutes = require("../modules/Images/routes/Image.routes");
const linkedinRoutes = require("../modules/LinkedIn/routes/LinkedIn.routes");
const scheduleRoutes = require("../modules/Schedules/routes/Schedule.routes");


function setupExpress(app) {
  app.use(cors({ origin: "http://localhost:5173", credentials: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get("/health", (req, res) => res.json({ status: "ok", timestamp: new Date().toISOString() }));

  app.use("/api/posts", postRoutes);
  app.use("/api/schedules", scheduleRoutes);
  app.use("/api/news", newsRoutes);

  app.use("/api/ai", aiRoutes);
  app.use("/api/images", imageRoutes);
  app.use("/auth/linkedin", linkedinRoutes);

  app.use(errorHandler);
}

module.exports = { setupExpress };

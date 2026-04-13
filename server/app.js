const express = require("express");
const env = require("./lib/config/env");
const { connectMongoDB } = require("./loaders/mongoose");
const { connectRedis } = require("./loaders/redis");
const { setupExpress } = require("./loaders/express");
const { startCronJobs } = require("./cron/jobs/contentPipeline.job");

async function bootstrap() {
  const app = express();

  await connectMongoDB();
  await connectRedis();

  setupExpress(app);
  startCronJobs();

  app.listen(env.port, () => {
    console.log(`[Server] Running on http://localhost:${env.port}`);
    console.log(`[Server] Environment: ${env.nodeEnv}`);
  });
}

bootstrap().catch((err) => {
  console.error("[Server] Fatal startup error:", err);
  process.exit(1);
});

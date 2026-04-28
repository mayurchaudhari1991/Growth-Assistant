import React from "react";
import { Route } from "react-router-dom";
import { DashboardPage, ContentPage, SchedulerPage } from "../../routes/elements.jsx";

import PATHS from "../../routes/paths.js";

const dashboardRoutes = (
  <>
    <Route path={PATHS.DASHBOARD} element={<DashboardPage />} />
    <Route path={PATHS.CONTENT} element={<ContentPage />} />
    <Route path={PATHS.SCHEDULER} element={<SchedulerPage />} />
  </>
);

export default dashboardRoutes;

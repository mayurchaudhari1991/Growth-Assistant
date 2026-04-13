import React from "react";
import { Route } from "react-router-dom";
import { DashboardPage } from "../../routes/elements.jsx";
import PATHS from "../../routes/paths.js";

const dashboardRoutes = (
  <Route path={PATHS.DASHBOARD} element={<DashboardPage />} />
);

export default dashboardRoutes;

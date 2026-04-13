import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import DashboardLayout from "../app/layout/DashboardLayout.jsx";
import PATHS from "./paths.js";
import { DashboardPage, HistoryPage, SettingsPage } from "./elements.jsx";

import dashboardRoutes from "../features/dashboard/routes.jsx";
import historyRoutes from "../features/history/routes.jsx";
import settingsRoutes from "../features/settings/routes.jsx";

function PageLoader() {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
      <CircularProgress />
    </Box>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Navigate to={PATHS.DASHBOARD} replace />} />
            {dashboardRoutes}
            {historyRoutes}
            {settingsRoutes}
            <Route path="*" element={<Navigate to={PATHS.DASHBOARD} replace />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

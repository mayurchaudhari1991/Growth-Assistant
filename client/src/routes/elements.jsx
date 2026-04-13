import { lazy } from "react";

export const DashboardPage = lazy(() => import("../features/dashboard/pages/DashboardPage.jsx"));
export const HistoryPage = lazy(() => import("../features/history/pages/HistoryPage.jsx"));
export const SettingsPage = lazy(() => import("../features/settings/pages/SettingsPage.jsx"));

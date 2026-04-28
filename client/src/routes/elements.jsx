import { lazy } from "react";

export const DashboardPage = lazy(() => import("../features/dashboard/pages/DashboardPage.jsx"));
export const ContentPage = lazy(() => import("../features/content/pages/ContentPage.jsx"));
export const SchedulerPage = lazy(() => import("../features/scheduler/pages/SchedulerPage.jsx"));

export const HistoryPage = lazy(() => import("../features/history/pages/HistoryPage.jsx"));

export const SettingsPage = lazy(() => import("../features/settings/pages/SettingsPage.jsx"));


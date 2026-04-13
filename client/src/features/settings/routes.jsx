import React from "react";
import { Route } from "react-router-dom";
import { SettingsPage } from "../../routes/elements.jsx";
import PATHS from "../../routes/paths.js";

const settingsRoutes = (
  <Route path={PATHS.SETTINGS} element={<SettingsPage />} />
);

export default settingsRoutes;

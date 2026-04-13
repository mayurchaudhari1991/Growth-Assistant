import React from "react";
import { Route } from "react-router-dom";
import { HistoryPage } from "../../routes/elements.jsx";
import PATHS from "../../routes/paths.js";

const historyRoutes = (
  <Route path={PATHS.HISTORY} element={<HistoryPage />} />
);

export default historyRoutes;

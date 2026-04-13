import React from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "./app/theme/index.js";
import { SnackbarProvider } from "./app/context/SnackbarContext.jsx";
import AppRouter from "./routes/index.jsx";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider>
        <AppRouter />
      </SnackbarProvider>
    </ThemeProvider>
  );
}

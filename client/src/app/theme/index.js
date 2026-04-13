import { createTheme, alpha } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#0a66c2",
      light: "#378fe9",
      dark: "#004182",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#70b5f9",
    },
    background: {
      default: "#0d1117",
      paper: "#161b22",
    },
    success: {
      main: "#2ea043",
    },
    warning: {
      main: "#d29922",
    },
    error: {
      main: "#f85149",
    },
    text: {
      primary: "#e6edf3",
      secondary: "#8b949e",
    },
    divider: "#30363d",
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', sans-serif",
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
    body2: { color: "#8b949e" },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: "1px solid #30363d",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 500 },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundImage: "none",
          backgroundColor: "#161b22",
          borderRight: "1px solid #30363d",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "#161b22",
          borderBottom: "1px solid #30363d",
          boxShadow: "none",
        },
      },
    },
  },
});

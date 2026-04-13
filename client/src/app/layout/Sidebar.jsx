import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HistoryIcon from "@mui/icons-material/History";
import SettingsIcon from "@mui/icons-material/Settings";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { useNavigate, useLocation } from "react-router-dom";
import PATHS from "../../routes/paths.js";

const NAV_ITEMS = [
  { label: "Dashboard", icon: <DashboardIcon />, path: PATHS.DASHBOARD },
  { label: "History", icon: <HistoryIcon />, path: PATHS.HISTORY },
  { label: "Settings", icon: <SettingsIcon />, path: PATHS.SETTINGS },
];

function SidebarContent() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ p: 2.5, display: "flex", alignItems: "center", gap: 1 }}>
        <AutoAwesomeIcon sx={{ color: "primary.light", fontSize: 28 }} />
        <Box>
          <Typography variant="subtitle1" fontWeight={700} lineHeight={1.2}>
            Growth
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Assistant
          </Typography>
        </Box>
      </Box>

      <Divider />

      <List sx={{ flexGrow: 1, pt: 1 }}>
        {NAV_ITEMS.map((item) => {
          const active = location.pathname.startsWith(item.path);
          return (
            <ListItem key={item.label} disablePadding sx={{ px: 1, mb: 0.5 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                selected={active}
                sx={{
                  borderRadius: 2,
                  "&.Mui-selected": {
                    bgcolor: "primary.dark",
                    "&:hover": { bgcolor: "primary.dark" },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: active ? "primary.light" : "text.secondary",
                    minWidth: 38,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: active ? 600 : 400,
                    color: active ? "text.primary" : "text.secondary",
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="caption" color="text.secondary">
          Powered by Gemma • Ollama
        </Typography>
      </Box>
    </Box>
  );
}

export default function Sidebar({ drawerWidth, mobileOpen, onClose }) {
  return (
    <>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { width: drawerWidth },
        }}
      >
        <SidebarContent />
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": { width: drawerWidth },
        }}
        open
      >
        <SidebarContent />
      </Drawer>
    </>
  );
}

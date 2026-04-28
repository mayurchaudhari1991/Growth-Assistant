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
  useTheme,
  alpha,
} from "@mui/material";
import {
  LayoutDashboard,
  FileText,
  CalendarDays,
  History,
  Settings,
  Zap,
  UserCircle,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import PATHS from "../../routes/paths.js";
import { motion } from "framer-motion";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, path: PATHS.DASHBOARD, color: "#6366f1" },
  { label: "Content", icon: FileText, path: PATHS.CONTENT, color: "#ec4899" },
  { label: "Scheduler", icon: CalendarDays, path: PATHS.SCHEDULER, color: "#f59e0b" },
  { label: "History", icon: History, path: PATHS.HISTORY, color: "#8b5cf6" },
  { label: "Settings", icon: Settings, path: PATHS.SETTINGS, color: "#94a3b8" },
];

function SidebarContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", bgcolor: "transparent" }}>
      {/* Brand Header */}
      <Box sx={{ p: 4, display: "flex", alignItems: "center", gap: 2 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 3,
            background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 16px rgba(99, 102, 241, 0.3)",
          }}
        >
          <Zap size={22} color="white" />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1, letterSpacing: -0.5 }}>
            Growth
          </Typography>
          <Typography variant="caption" sx={{ color: "primary.light", fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
            Assistant
          </Typography>
        </Box>
      </Box>

      {/* Navigation List */}
      <List sx={{ flexGrow: 1, px: 2, pt: 2 }}>
        {NAV_ITEMS.map((item) => {
          const active = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <ListItem key={item.label} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 4,
                  py: 1.5,
                  position: "relative",
                  transition: "all 0.2s",
                  bgcolor: active ? alpha(item.color, 0.1) : "transparent",
                  "&:hover": {
                    bgcolor: alpha(item.color, 0.05),
                    transform: "translateX(4px)",
                  },
                }}
              >
                {active && (
                  <motion.div
                    layoutId="active-pill"
                    style={{
                      position: "absolute",
                      left: 0,
                      width: 4,
                      height: "60%",
                      borderRadius: "0 4px 4px 0",
                      backgroundColor: item.color,
                    }}
                  />
                )}
                <ListItemIcon
                  sx={{
                    color: active ? item.color : "text.secondary",
                    minWidth: 45,
                  }}
                >
                  <Icon size={22} strokeWidth={active ? 2.5 : 2} />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: active ? 700 : 500,
                    fontSize: "0.95rem",
                    color: active ? "text.primary" : "text.secondary",
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* User Profile / Bottom Section */}
      <Box sx={{ p: 3, mb: 2 }}>
        <Box
          sx={{
            p: 2,
            borderRadius: 4,
            bgcolor: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.05)",
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              bgcolor: "rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <UserCircle size={20} />
          </Box>
          <Box sx={{ overflow: "hidden" }}>
            <Typography variant="body2" sx={{ fontWeight: 700, noWrap: true }}>
              Demo User
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary", noWrap: true }}>
              Pro Plan
            </Typography>
          </Box>
        </Box>
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
          "& .MuiDrawer-paper": { 
            width: drawerWidth,
            boxShadow: "none",
          },
        }}
      >
        <SidebarContent />
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": { 
            width: drawerWidth,
            borderRight: "1px solid rgba(255,255,255,0.05)",
            boxShadow: "none",
          },
        }}
        open
      >
        <SidebarContent />
      </Drawer>
    </>
  );
}

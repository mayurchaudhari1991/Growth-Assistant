import React, { useState } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import Topbar from "./Topbar.jsx";
import Sidebar from "./Sidebar.jsx";
import CustomPostModal from "../../features/dashboard/components/CustomPostModal.jsx";

const DRAWER_WIDTH = 240;

export default function DashboardLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const handleToggle = () => setMobileOpen((prev) => !prev);

  const handlePostCreated = () => {
    window.dispatchEvent(new Event("post-created"));
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <Topbar
        drawerWidth={DRAWER_WIDTH}
        onMenuClick={handleToggle}
        onCreatePost={() => setCreateModalOpen(true)}
      />
      <Sidebar
        drawerWidth={DRAWER_WIDTH}
        mobileOpen={mobileOpen}
        onClose={handleToggle}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 3 },
          mt: "64px",
          ml: { md: `${DRAWER_WIDTH}px` },
          minHeight: "calc(100vh - 64px)",
        }}
      >
        <Outlet />
      </Box>

      <CustomPostModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onPostCreated={handlePostCreated}
      />
    </Box>
  );
}

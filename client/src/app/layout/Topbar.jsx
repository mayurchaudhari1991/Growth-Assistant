import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Chip,
  Button,
  Avatar,
  Stack,
  alpha,
} from "@mui/material";
import { Menu, Plus, Bell, Search, Zap } from "lucide-react";

export default function Topbar({ drawerWidth, onMenuClick, onCreatePost }) {
  return (
    <AppBar
      position="fixed"
      sx={{
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
        backgroundColor: "rgba(15, 23, 42, 0.7)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
        boxShadow: "none",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, md: 4 } }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <IconButton
            color="inherit"
            edge="start"
            onClick={onMenuClick}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <Menu size={24} />
          </IconButton>

          {/* Search Bar (Mockup) */}
          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              alignItems: "center",
              bgcolor: "rgba(255,255,255,0.05)",
              borderRadius: 3,
              px: 2,
              py: 0.8,
              width: 300,
              gap: 1.5,
              border: "1px solid rgba(255,255,255,0.05)",
              transition: "border-color 0.2s",
              "&:hover": { borderColor: "rgba(255,255,255,0.2)" },
            }}
          >
            <Search size={18} color="rgba(255,255,255,0.4)" />
            <Box
              component="input"
              placeholder="Search posts or analytics..."
              sx={{
                bgcolor: "transparent",
                border: "none",
                outline: "none",
                color: "white",
                fontSize: "0.9rem",
                width: "100%",
                "&::placeholder": { color: "rgba(255,255,255,0.3)" },
              }}
            />
          </Box>
        </Stack>

        <Stack direction="row" spacing={2} alignItems="center">
          <Chip
            icon={<Zap size={14} color="#10b981" />}
            label="Gemma 2b Active"
            size="small"
            sx={{
              bgcolor: alpha("#10b981", 0.1),
              color: "#10b981",
              borderColor: alpha("#10b981", 0.2),
              fontWeight: 700,
              display: { xs: "none", sm: "flex" },
            }}
          />

          <IconButton sx={{ color: "text.secondary" }}>
            <Bell size={20} />
          </IconButton>

          <Button
            variant="contained"
            startIcon={<Plus size={18} />}
            onClick={onCreatePost}
            sx={{
              display: { xs: "none", sm: "flex" },
              px: 3,
              borderRadius: 3,
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            }}
          >
            Create
          </Button>

          <Avatar
            sx={{
              width: 38,
              height: 38,
              bgcolor: "primary.main",
              cursor: "pointer",
              border: "2px solid rgba(255,255,255,0.1)",
            }}
          >
            M
          </Avatar>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

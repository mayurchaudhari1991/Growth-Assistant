import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Chip,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import AddIcon from "@mui/icons-material/Add";

export default function Topbar({ drawerWidth, onMenuClick, onCreatePost }) {
  return (
    <AppBar
      position="fixed"
      sx={{
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2, display: { md: "none" } }}
        >
          <MenuIcon />
        </IconButton>

        <Box
          sx={{ display: "flex", alignItems: "center", gap: 1, flexGrow: 1 }}
        >
          <AutoAwesomeIcon sx={{ color: "primary.light" }} />
          <Typography variant="h6" noWrap>
            Growth Assistant
          </Typography>
        </Box>

        <Chip
          label="Local AI"
          size="small"
          color="success"
          variant="outlined"
          sx={{ mr: 2 }}
        />

        <Button
          variant="contained"
          color="secondary"
          size="small"
          startIcon={<AddIcon />}
          onClick={onCreatePost}
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          Create Post
        </Button>
      </Toolbar>
    </AppBar>
  );
}

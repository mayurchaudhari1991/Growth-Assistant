import React from "react";
import { Box, Typography } from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";

export default function EmptyState({ title = "Nothing here", subtitle = "" }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 10,
        gap: 1.5,
        color: "text.secondary",
      }}
    >
      <InboxIcon sx={{ fontSize: 56, opacity: 0.3 }} />
      <Typography variant="h6" color="text.secondary">
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary" textAlign="center" maxWidth={360}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}

import React from "react";
import { Chip } from "@mui/material";
import PendingIcon from "@mui/icons-material/HourglassEmpty";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BlockIcon from "@mui/icons-material/Block";

const CONFIG = {
  pending: { label: "Pending", color: "warning", icon: <PendingIcon /> },
  posted: { label: "Posted", color: "success", icon: <CheckCircleIcon /> },
  skipped: { label: "Skipped", color: "default", icon: <BlockIcon /> },
};

export default function StatusChip({ status }) {
  const cfg = CONFIG[status] || CONFIG.pending;
  return (
    <Chip
      label={cfg.label}
      color={cfg.color}
      size="small"
      icon={cfg.icon}
      variant="outlined"
    />
  );
}

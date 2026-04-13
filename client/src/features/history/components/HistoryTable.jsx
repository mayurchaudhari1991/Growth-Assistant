import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Typography,
  Box,
  Link,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import dayjs from "dayjs";
import StatusChip from "../../../shared/common/StatusChip.jsx";

export default function HistoryTable({ posts, onDelete }) {
  return (
    <TableContainer component={Paper} sx={{ border: "1px solid", borderColor: "divider" }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: "text.secondary", fontWeight: 600 }}>Title</TableCell>
            <TableCell sx={{ color: "text.secondary", fontWeight: 600 }}>Source</TableCell>
            <TableCell sx={{ color: "text.secondary", fontWeight: 600 }}>Status</TableCell>
            <TableCell sx={{ color: "text.secondary", fontWeight: 600 }}>Created</TableCell>
            <TableCell sx={{ color: "text.secondary", fontWeight: 600 }}>Posted At</TableCell>
            <TableCell align="right" sx={{ color: "text.secondary", fontWeight: 600 }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post._id} hover>
              <TableCell sx={{ maxWidth: 280 }}>
                <Typography variant="body2" noWrap title={post.title}>
                  {post.title}
                </Typography>
              </TableCell>
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">
                    {post.feedName || "—"}
                  </Typography>
                  {post.sourceUrl && (
                    <Tooltip title="View article">
                      <IconButton
                        size="small"
                        component={Link}
                        href={post.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <OpenInNewIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              </TableCell>
              <TableCell>
                <StatusChip status={post.status} />
              </TableCell>
              <TableCell>
                <Typography variant="caption" color="text.secondary">
                  {dayjs(post.createdAt).format("MMM D, YYYY HH:mm")}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="caption" color="text.secondary">
                  {post.postedAt ? dayjs(post.postedAt).format("MMM D, YYYY HH:mm") : "—"}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Tooltip title="Delete">
                  <IconButton size="small" onClick={() => onDelete(post._id)} color="error">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

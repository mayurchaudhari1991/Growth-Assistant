import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Box,
  Typography,
  Button,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  Collapse,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import EditIcon from "@mui/icons-material/Edit";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function PostCard({ post, onPublish, onEdit, onSkip, publishing }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = post.content.length > 300;
  const displayContent = isLong && !expanded ? post.content.slice(0, 300) + "..." : post.content;

  return (
    <Card sx={{ mb: 3, overflow: "hidden" }}>
      {post.imageUrl && (
        <CardMedia
          component="img"
          height="200"
          image={post.imageUrl}
          alt={post.title}
          sx={{ objectFit: "cover" }}
        />
      )}

      <CardContent sx={{ pb: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Chip label={post.feedName || "News"} size="small" variant="outlined" color="primary" />
            <Typography variant="caption" color="text.secondary" sx={{ alignSelf: "center" }}>
              {dayjs(post.createdAt).fromNow()}
            </Typography>
          </Box>
          <Tooltip title="View original article">
            <IconButton size="small" href={post.sourceUrl} target="_blank" rel="noopener noreferrer">
              <OpenInNewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          {post.title}
        </Typography>

        <Box
          sx={{
            bgcolor: "background.default",
            borderRadius: 2,
            p: 2,
            mt: 1,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography
            variant="body2"
            sx={{ whiteSpace: "pre-line", lineHeight: 1.8, color: "text.primary" }}
          >
            {displayContent}
          </Typography>
          {isLong && (
            <Button
              size="small"
              onClick={() => setExpanded(!expanded)}
              endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              sx={{ mt: 1, p: 0 }}
            >
              {expanded ? "Show less" : "Show more"}
            </Button>
          )}
        </Box>

        {post.imageCredit && (
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
            {post.imageCredit}
          </Typography>
        )}
      </CardContent>

      <Divider />

      <Box sx={{ display: "flex", gap: 1, p: 2, flexWrap: "wrap" }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SendIcon />}
          onClick={() => onPublish(post._id)}
          disabled={publishing === post._id}
          size="small"
        >
          {publishing === post._id ? "Posting..." : "Post to LinkedIn"}
        </Button>
        <Button
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={() => onEdit(post)}
          size="small"
        >
          Edit
        </Button>
        <Button
          variant="text"
          color="inherit"
          startIcon={<SkipNextIcon />}
          onClick={() => onSkip(post._id)}
          size="small"
          sx={{ color: "text.secondary" }}
        >
          Skip
        </Button>
      </Box>
    </Card>
  );
}

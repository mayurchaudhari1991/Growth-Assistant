import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Box,
  Typography,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Stack,
  alpha,
  useTheme,
} from "@mui/material";
import {
  Send,
  Edit3,
  Trash2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle2,
} from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function PostCard({ post, onPublish, onEdit, onSkip, publishing }) {
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();
  
  const isLong = post.content.length > 250;
  const displayContent = isLong && !expanded ? post.content.slice(0, 250) + "..." : post.content;

  return (
    <Card className="glass-card" sx={{ mb: 4, overflow: "hidden" }}>
      <Box sx={{ position: "relative" }}>
        {post.imageUrl && (
          <CardMedia
            component="img"
            height="240"
            image={post.imageUrl}
            alt={post.title}
            sx={{ 
              objectFit: "cover",
              filter: "brightness(0.8)",
              transition: "transform 0.5s ease",
              "&:hover": { transform: "scale(1.05)" }
            }}
          />
        )}
        <Box
          sx={{
            position: "absolute",
            top: 16,
            left: 16,
            display: "flex",
            gap: 1,
          }}
        >
          <Chip
            label={post.feedName || "IT News"}
            size="small"
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.8),
              backdropFilter: "blur(4px)",
              color: "white",
              fontWeight: 700,
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          />
        </Box>
      </Box>

      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Clock size={14} color={theme.palette.text.secondary} />
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              Generated {dayjs(post.createdAt).fromNow()}
            </Typography>
          </Stack>
          <Tooltip title="Source Article">
            <IconButton
              size="small"
              href={post.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: "primary.light" }}
            >
              <ExternalLink size={18} />
            </IconButton>
          </Tooltip>
        </Stack>

        <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, lineHeight: 1.3 }}>
          {post.title}
        </Typography>

        <Box
          sx={{
            bgcolor: "rgba(255,255,255,0.03)",
            borderRadius: 4,
            p: 2.5,
            mb: 2,
            border: "1px solid rgba(255,255,255,0.05)",
            position: "relative",
          }}
        >
          <Typography
            variant="body2"
            sx={{ 
              whiteSpace: "pre-line", 
              lineHeight: 1.8, 
              color: "text.primary",
              fontSize: "0.95rem"
            }}
          >
            {displayContent}
          </Typography>
          
          {isLong && (
            <Button
              size="small"
              onClick={() => setExpanded(!expanded)}
              endIcon={expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              sx={{ mt: 1, fontWeight: 700, p: 0 }}
            >
              {expanded ? "Read Less" : "Read Full Post"}
            </Button>
          )}
        </Box>

        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
          <Button
            variant="contained"
            fullWidth
            startIcon={publishing === post._id ? null : <Send size={18} />}
            onClick={() => onPublish(post._id)}
            disabled={publishing === post._id}
            sx={{
              py: 1.5,
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              boxShadow: "0 4px 12px rgba(16, 185, 129, 0.2)",
            }}
          >
            {publishing === post._id ? "Publishing..." : "Post to LinkedIn"}
          </Button>
          <Button
            variant="outlined"
            onClick={() => onEdit(post)}
            sx={{
              minWidth: 56,
              borderRadius: 3,
              borderColor: "rgba(255,255,255,0.1)",
            }}
          >
            <Edit3 size={18} />
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => onSkip(post._id)}
            sx={{
              minWidth: 56,
              borderRadius: 3,
              borderColor: alpha(theme.palette.error.main, 0.2),
              "&:hover": { bgcolor: alpha(theme.palette.error.main, 0.05) }
            }}
          >
            <Trash2 size={18} />
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

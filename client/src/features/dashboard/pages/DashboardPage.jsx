import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Alert,
  CircularProgress,
  Pagination,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import usePendingPosts from "../hooks/usePendingPosts.js";
import PostCard from "../components/PostCard.jsx";
import PostEditModal from "../components/PostEditModal.jsx";
import EmptyState from "../../../shared/common/EmptyState.jsx";
import { useSnackbar } from "../../../shared/snackbar/useSnackbar.js";
import {
  publishPost,
  skipPost,
  updatePost,
  triggerPipeline,
} from "../api/dashboard.api.js";

export default function DashboardPage() {
  const { posts, stats, loading, error, page, setPage, totalPages, refresh } =
    usePendingPosts();
  const showSnackbar = useSnackbar();

  const [publishing, setPublishing] = useState(null);
  const [editPost, setEditPost] = useState(null);
  const [saving, setSaving] = useState(false);
  const [triggering, setTriggering] = useState(false);

  const handlePublish = async (id) => {
    setPublishing(id);
    try {
      await publishPost(id);
      showSnackbar("Post published to LinkedIn!", "success");
      refresh();
    } catch (err) {
      showSnackbar(err.message, "error");
    } finally {
      setPublishing(null);
    }
  };

  const handleSkip = async (id) => {
    try {
      await skipPost(id);
      showSnackbar("Post skipped", "info");
      refresh();
    } catch (err) {
      showSnackbar(err.message, "error");
    }
  };

  const handleSaveEdit = async (data) => {
    setSaving(true);
    try {
      await updatePost(editPost._id, data);
      showSnackbar("Post updated", "success");
      setEditPost(null);
      refresh();
    } catch (err) {
      showSnackbar(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleTrigger = async () => {
    setTriggering(true);
    try {
      await triggerPipeline();
      showSnackbar("Pipeline triggered! New draft is being generated...", "success");
      setTimeout(refresh, 3000);
    } catch (err) {
      showSnackbar(err.message, "error");
    } finally {
      setTriggering(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box>
          <Typography variant="h5">Dashboard</Typography>
          <Typography variant="body2" color="text.secondary">
            Review and approve your AI-generated LinkedIn posts
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={refresh}
            disabled={loading}
            size="small"
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={triggering ? <CircularProgress size={16} color="inherit" /> : <AddIcon />}
            onClick={handleTrigger}
            disabled={triggering}
            size="small"
          >
            Generate Now
          </Button>
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: "Pending", value: stats.pending, color: "#d29922" },
          { label: "Posted", value: stats.posted, color: "#2ea043" },
          { label: "Skipped", value: stats.skipped, color: "#8b949e" },
          { label: "Total", value: stats.total, color: "#378fe9" },
        ].map((stat) => (
          <Grid item xs={6} sm={3} key={stat.label}>
            <Paper
              sx={{
                p: 2,
                textAlign: "center",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography variant="h4" fontWeight={700} sx={{ color: stat.color }}>
                {stat.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stat.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : posts.length === 0 ? (
        <EmptyState
          title="No pending posts"
          subtitle='Click "Generate Now" to fetch fresh IT news and create a new post draft.'
        />
      ) : (
        <>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <AutoAwesomeIcon fontSize="small" sx={{ color: "primary.light" }} />
            <Typography variant="subtitle1">
              {stats.pending} post{stats.pending !== 1 ? "s" : ""} waiting for approval
            </Typography>
          </Box>

          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onPublish={handlePublish}
              onEdit={setEditPost}
              onSkip={handleSkip}
              publishing={publishing}
            />
          ))}

          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, v) => setPage(v)}
                color="primary"
              />
            </Box>
          )}
        </>
      )}

      <PostEditModal
        open={!!editPost}
        post={editPost}
        onSave={handleSaveEdit}
        onClose={() => setEditPost(null)}
        saving={saving}
      />
    </Box>
  );
}

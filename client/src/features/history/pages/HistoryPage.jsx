import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  CircularProgress,
  Alert,
  Pagination,
} from "@mui/material";
import HistoryTable from "../components/HistoryTable.jsx";
import EmptyState from "../../../shared/common/EmptyState.jsx";
import ConfirmDialog from "../../../shared/modal/ConfirmDialog.jsx";
import { useSnackbar } from "../../../shared/snackbar/useSnackbar.js";
import { fetchHistory, deletePost } from "../api/history.api.js";

const STATUS_FILTERS = [
  { value: "all", label: "All" },
  { value: "posted", label: "Posted" },
  { value: "skipped", label: "Skipped" },
  { value: "pending", label: "Pending" },
];

export default function HistoryPage() {
  const showSnackbar = useSnackbar();
  const [status, setStatus] = useState("all");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteId, setDeleteId] = useState(null);

  const load = useCallback(
    async (p = 1) => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchHistory(status, p);
        setPosts(data.posts);
        setTotalPages(data.pages);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [status]
  );

  useEffect(() => {
    setPage(1);
    load(1);
  }, [status, load]);

  useEffect(() => {
    load(page);
  }, [page, load]);

  const handleDelete = async () => {
    try {
      await deletePost(deleteId);
      showSnackbar("Post deleted", "success");
      setDeleteId(null);
      load(page);
    } catch (err) {
      showSnackbar(err.message, "error");
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5">History</Typography>
        <Typography variant="body2" color="text.secondary">
          All generated posts — posted, skipped, and pending
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <ToggleButtonGroup
          value={status}
          exclusive
          onChange={(_, v) => v && setStatus(v)}
          size="small"
        >
          {STATUS_FILTERS.map((f) => (
            <ToggleButton key={f.value} value={f.value}>
              {f.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

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
        <EmptyState title="No posts found" subtitle="Posts will appear here after the pipeline runs." />
      ) : (
        <>
          <HistoryTable posts={posts} onDelete={setDeleteId} />
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

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Post"
        message="This will permanently delete the post. Are you sure?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        confirmLabel="Delete"
        confirmColor="error"
      />
    </Box>
  );
}

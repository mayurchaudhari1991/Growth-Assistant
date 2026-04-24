import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Chip,
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import { customGeneratePost } from "../api/dashboard.api";

const EXAMPLES = [
  "Why callback functions are essential in JavaScript async programming",
  "How I built a rate limiter for my Node.js API from scratch",
  "Top 5 mistakes developers make when designing REST APIs",
  "Why every developer should learn Docker in 2025",
];

export default function CustomPostModal({ open, onClose, onPostCreated }) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError("");
    try {
      const data = await customGeneratePost(prompt.trim());
      onPostCreated(data.post);
      setPrompt("");
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate post. Make sure Ollama is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    setPrompt("");
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AutoAwesomeIcon color="primary" />
          <Typography variant="h6">Create Custom Post</Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Describe your idea, topic, or insight in a few words or sentences. The AI will generate a full LinkedIn post from it.
        </Typography>

        <TextField
          autoFocus
          fullWidth
          multiline
          minRows={3}
          maxRows={6}
          label="Your prompt or idea"
          placeholder="e.g. How implementing a queue system reduced our API response time by 60%"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={loading}
          inputProps={{ maxLength: 500 }}
          helperText={`${prompt.length}/500`}
        />

        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
            <LightbulbOutlinedIcon sx={{ fontSize: 14, color: "text.secondary" }} />
            <Typography variant="caption" color="text.secondary">
              Try one of these:
            </Typography>
          </Box>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
            {EXAMPLES.map((ex) => (
              <Chip
                key={ex}
                label={ex}
                size="small"
                variant="outlined"
                clickable
                disabled={loading}
                onClick={() => setPrompt(ex)}
                sx={{ fontSize: "0.7rem" }}
              />
            ))}
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {loading && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mt: 2, p: 1.5, bgcolor: "action.hover", borderRadius: 1 }}>
            <CircularProgress size={18} />
            <Typography variant="body2" color="text.secondary">
              Generating your LinkedIn post... this takes ~30 seconds
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleGenerate}
          disabled={!prompt.trim() || loading}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <AutoAwesomeIcon />}
        >
          {loading ? "Generating..." : "Generate Post"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

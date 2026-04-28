import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function PostEditModal({ open, post, onSave, onClose, saving }) {
  const [content, setContent] = useState("");

  useEffect(() => {
    if (post) setContent(post.content);
  }, [post]);

  const handleSave = () => {
    onSave({ content });
  };

  const charCount = content.length;
  const isOverLimit = charCount > 3000;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6">Edit Post</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <TextField
          fullWidth
          multiline
          minRows={10}
          maxRows={20}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your LinkedIn post..."
          error={isOverLimit}
          helperText={
            <Box component="span" sx={{ display: "flex", justifyContent: "space-between" }}>
              <span>{isOverLimit ? "Post exceeds 3000 character limit" : "Edit the generated post before approving"}</span>
              <span style={{ color: isOverLimit ? "#f85149" : "#8b949e" }}>{charCount}/3000</span>
            </Box>
          }
          sx={{
            "& .MuiInputBase-root": { fontFamily: "monospace", fontSize: "0.9rem", lineHeight: 1.6 },
          }}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={saving || isOverLimit || content.trim().length < 10}
        >
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

import React from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  Stack,
  useTheme,
  alpha,
  Card,
  CardContent,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Plus, Filter, LayoutGrid, List as ListIcon, Zap, FileText, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import PostCard from "../components/PostCard.jsx";
import usePendingPosts from "../hooks/usePendingPosts.js";
import { generatePost, publishPost, skipPost } from "../api/content.api.js";
import { useSnackbar } from "../../../app/context/SnackbarContext.jsx";


const ContentStat = ({ label, value, icon: Icon, color }) => (

  <Card className="glass-card" sx={{ flexGrow: 1 }}>
    <CardContent sx={{ p: "16px !important" }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Box sx={{ p: 1, borderRadius: 2, bgcolor: alpha(color, 0.1), color: color }}>
          <Icon size={20} />
        </Box>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>{value}</Typography>
          <Typography variant="caption" color="text.secondary">{label}</Typography>
        </Box>
      </Stack>
    </CardContent>
  </Card>
);

export default function ContentPage() {
  const theme = useTheme();
  const { posts, stats, loading, refresh } = usePendingPosts();
  const [generating, setGenerating] = React.useState(false);
  const [filterActive, setFilterActive] = React.useState(false);
  const showSnackbar = useSnackbar();

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      showSnackbar("Triggering AI generation...", "info");
      await generatePost();
      await refresh();
      showSnackbar("AI Generation successful!", "success");
    } catch (err) {
      console.error("Generation failed:", err);
      showSnackbar("Generation failed. Check server logs.", "error");
    } finally {
      setGenerating(false);
    }
  };

  const handlePublish = async (id) => {
    try {
      await publishPost(id);
      refresh();
      showSnackbar("Post published to LinkedIn!", "success");
    } catch (err) {
      showSnackbar("Publish failed: " + err.message, "error");
    }
  };

  const handleSkip = async (id) => {
    try {
      await skipPost(id);
      refresh();
      showSnackbar("Post skipped.", "info");
    } catch (err) {
      showSnackbar("Skip failed: " + err.message, "error");
    }
  };


  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ mb: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography variant="h3" sx={{ mb: 1, fontWeight: 800 }}>
            Content <span className="gradient-text">Library</span>
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your drafts, approved posts, and published content.
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button
            variant={filterActive ? "contained" : "outlined"}
            onClick={() => setFilterActive(!filterActive)}
            startIcon={<Filter size={18} />}
            sx={{ borderRadius: 3 }}
          >
            {filterActive ? "Filtering..." : "Filter"}
          </Button>
          <Button
            variant="contained"
            disabled={generating}
            onClick={handleGenerate}
            startIcon={generating ? <CircularProgress size={18} color="inherit" /> : <Zap size={18} />}
            sx={{ borderRadius: 3, px: 3 }}
          >
            {generating ? "Generating..." : "Generate Now"}
          </Button>
        </Stack>
      </Box>


      {/* Content Stats */}
      <Stack direction="row" spacing={3} sx={{ mb: 6 }}>
        <ContentStat label="Total Drafts" value={stats.pending || 0} icon={FileText} color={theme.palette.primary.main} />
        <ContentStat label="Approved" value={stats.posted || 0} icon={CheckCircle2} color={theme.palette.success.main} />
        <ContentStat label="Scheduled" value={stats.pending || 0} icon={Clock} color={theme.palette.warning.main} />
        <ContentStat label="AI Generations" value={stats.total || 0} icon={Zap} color={theme.palette.secondary.main} />
      </Stack>

      <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>Pending Review</Typography>
        <Stack direction="row" spacing={1}>
           <IconButton size="small"><LayoutGrid size={18} /></IconButton>
           <IconButton size="small"><ListIcon size={18} /></IconButton>
        </Stack>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
          <CircularProgress />
        </Box>
      ) : posts.length === 0 ? (
        <Card className="glass-card" sx={{ p: 10, textAlign: "center" }}>
           <AlertCircle size={48} color={theme.palette.text.secondary} style={{ marginBottom: "16px", opacity: 0.5 }} />
           <Typography variant="h6" color="text.secondary">No pending posts found</Typography>
           <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>Click 'Generate Now' to create some AI magic!</Typography>
           <Button variant="outlined" onClick={handleGenerate} startIcon={<Zap size={18} />}>Generate First Post</Button>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {posts.map((post) => (
            <Grid item xs={12} md={6} key={post._id}>
               <PostCard 
                 post={post} 
                 onPublish={() => handlePublish(post._id)} 
                 onEdit={() => {}} 
                 onSkip={() => handleSkip(post._id)}
               />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

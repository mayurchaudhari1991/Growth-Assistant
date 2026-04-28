import React from "react";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Stack,
  IconButton,
  Button,
  useTheme,
  alpha,
} from "@mui/material";
import {
  TrendingUp,
  Users,
  MessageSquare,
  Calendar,
  Zap,
  MoreVertical,
  ArrowUpRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import usePendingPosts from "../../content/hooks/usePendingPosts.js";
import { useSnackbar } from "../../../app/context/SnackbarContext.jsx";
import { generatePost } from "../../content/api/content.api.js";


const StatCard = ({ title, value, icon: Icon, color, trend }) => {
  const theme = useTheme();
  return (
    <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
      <Card className="glass-card stat-3d" sx={{ height: '100%' }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box
              sx={{
                p: 1.5,
                borderRadius: 3,
                bgcolor: alpha(color, 0.1),
                color: color,
              }}
            >
              <Icon size={24} />
            </Box>
            {trend && (
              <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: "success.main" }}>
                <Typography variant="caption" sx={{ fontWeight: 700 }}>
                  +{trend}%
                </Typography>
                <ArrowUpRight size={14} />
              </Stack>
            )}
          </Stack>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mb: 0.5 }}>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              {value}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function DashboardPage() {
  const theme = useTheme();
  const { stats } = usePendingPosts();
  const showSnackbar = useSnackbar();

  // Default values while loading
  const reach = stats.reach || { value: "0", trend: 0 };
  const followers = stats.followers || { value: "0", trend: 0 };
  const engagement = stats.engagementRate || { value: "0%", trend: 0 };
  const weeklyData = stats.weeklyEngagement || [];

  const handleGenerate = async () => {
    try {
      showSnackbar("Triggering AI generation...", "info");
      await generatePost();
      window.dispatchEvent(new CustomEvent("post-created"));
      showSnackbar("AI Generation successful! Check Content Library.", "success");
    } catch (err) {
      console.error("Generation failed:", err);
      showSnackbar("Generation failed. Check server logs.", "error");
    }
  };



  return (
    <Box sx={{ p: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography variant="h3" sx={{ mb: 1, fontWeight: 800 }}>
            Growth <span className="gradient-text">Insights</span>
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back! Here's how your LinkedIn brand is performing today.
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={handleGenerate}
          startIcon={<Zap size={18} />}
          sx={{ borderRadius: 3, px: 3, py: 1.5 }}
        >
          Generate New Post
        </Button>
      </Box>


      {/* Main Stats */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Reach"
            value={reach.value}
            icon={TrendingUp}
            color={theme.palette.primary.main}
            trend={reach.trend}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Followers"
            value={followers.value}
            icon={Users}
            color={theme.palette.secondary.main}
            trend={followers.trend}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Engagement Rate"
            value={engagement.value}
            icon={MessageSquare}
            color="#8b5cf6"
            trend={engagement.trend}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Jobs"
            value={stats.pending || 0}
            icon={Calendar}
            color={theme.palette.success.main}
          />
        </Grid>
      </Grid>

      {/* Overview Chart */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card className="glass-card" sx={{ p: 2 }}>
            <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="h6">Weekly Overview</Typography>
              <IconButton size="small"><MoreVertical size={18} /></IconButton>
            </Box>
            <Box sx={{ height: 400, width: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: theme.palette.text.secondary, fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: theme.palette.text.secondary, fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      borderRadius: "12px",
                      border: "1px solid rgba(255,255,255,0.1)",
                      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)"
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={theme.palette.primary.main}
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorValue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}


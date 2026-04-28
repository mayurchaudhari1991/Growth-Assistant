import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  alpha,
  useTheme,
  Switch,
  Button,
  Chip,
  CircularProgress,
} from "@mui/material";
import { Calendar, Clock, Sun, Sunrise, Sunset, Settings, Plus, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useSchedules from "../hooks/useSchedules.js";
import usePendingPosts from "../../content/hooks/usePendingPosts.js";



const ScheduleCard = ({ schedule, onToggle }) => {
  const theme = useTheme();
  const { startTime, endTime, label, isActive, name } = schedule;
  
  const icons = {
    morning: Sunrise,
    afternoon: Sun,
    evening: Sunset,
  };
  
  const colors = {
    morning: "#fbbf24",
    afternoon: "#f97316",
    evening: "#818cf8",
  };

  const Icon = icons[name] || Clock;
  const color = colors[name] || theme.palette.primary.main;
  const timeLabel = `${startTime}:00 - ${endTime}:00`;

  return (
    <Card className="glass-card" sx={{ height: "100%", position: "relative", overflow: "hidden" }}>
      {!isActive && <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, bgcolor: "rgba(0,0,0,0.4)", zIndex: 1, backdropFilter: "grayscale(1) blur(2px)" }} />}
      <CardContent sx={{ p: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 4 }}>
          <Box sx={{ p: 2, borderRadius: 3, bgcolor: alpha(color, 0.1), color: color }}>
            <Icon size={32} />
          </Box>
          <Switch 
            checked={isActive} 
            onChange={(e) => onToggle(schedule._id, { isActive: e.target.checked })}
            sx={{ zIndex: 2 }}
          />
        </Stack>
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>{timeLabel}</Typography>
        <Typography variant="body1" sx={{ fontWeight: 600, color: "text.secondary", mb: 3 }}>{label}</Typography>
        <Box sx={{ p: 2, borderRadius: 2, bgcolor: "rgba(255,255,255,0.03)", border: "1px dashed rgba(255,255,255,0.1)" }}>
           <Typography variant="caption" color="text.secondary">Next Post: Randomised between {timeLabel}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default function SchedulerPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { schedules, loading: schedulesLoading, updateSchedule } = useSchedules();
  const { posts, loading: postsLoading } = usePendingPosts();

  const loading = schedulesLoading || postsLoading;

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ mb: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography variant="h3" sx={{ mb: 1, fontWeight: 800 }}>
            Post <span className="gradient-text">Scheduler</span>
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Randomised automated posting windows to mimic human behaviour.
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={() => navigate("/settings")}
          startIcon={<Settings size={18} />}
          sx={{ borderRadius: 3, px: 3 }}
        >
          Schedule Settings
        </Button>
      </Box>

      <Grid container spacing={4} sx={{ mb: 6 }}>
        {schedules.map((s) => (
          <Grid item xs={12} md={4} key={s._id}>
            <ScheduleCard 
              schedule={s}
              onToggle={updateSchedule}
            />
          </Grid>
        ))}
      </Grid>

      <Card className="glass-card" sx={{ p: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
            <Box>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>Queue Overview</Typography>
                <Typography variant="body2" color="text.secondary">Upcoming automated posts</Typography>
            </Box>
            <Button size="small" variant="text" onClick={() => navigate("/content")} startIcon={<Plus size={16} />}>View Library</Button>
        </Stack>
        
        <Stack spacing={2}>
            {posts.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>No posts in queue. Generate some content!</Typography>
            ) : posts.slice(0, 5).map((post) => (
                <Box key={post._id} sx={{ p: 2, borderRadius: 3, bgcolor: "rgba(255,255,255,0.02)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Box 
                          component="img" 
                          src={post.imageUrl} 
                          sx={{ width: 48, height: 48, borderRadius: 2, objectFit: 'cover', bgcolor: "rgba(255,255,255,0.05)" }} 
                        />
                        <Box>
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>{post.title}</Typography>
                            <Typography variant="caption" color="text.secondary">
                                {post.feedName} • {new Date(post.createdAt).toLocaleDateString()}
                            </Typography>
                        </Box>
                    </Stack>
                    <Chip label="Pending" size="small" sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1), color: theme.palette.warning.main }} />
                </Box>
            ))}
        </Stack>
      </Card>
    </Box>
  );
}


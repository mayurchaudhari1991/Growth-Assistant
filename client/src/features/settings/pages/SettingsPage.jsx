import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
} from "@mui/material";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import ImageIcon from "@mui/icons-material/Image";
import ScheduleIcon from "@mui/icons-material/Schedule";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import LinkedInConnect from "../components/LinkedInConnect.jsx";
import { useSnackbar } from "../../../shared/snackbar/useSnackbar.js";
import {
  fetchLinkedInStatus,
  fetchAiHealth,
  fetchStats,
} from "../api/settings.api.js";
import { useSearchParams } from "react-router-dom";

export default function SettingsPage() {
  const showSnackbar = useSnackbar();
  const [searchParams, setSearchParams] = useSearchParams();

  const [linkedinStatus, setLinkedinStatus] = useState(null);
  const [aiHealth, setAiHealth] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (searchParams.get("connected") === "true") {
      showSnackbar("LinkedIn connected successfully!", "success");
      setSearchParams({});
    }
    if (searchParams.get("error")) {
      showSnackbar(`LinkedIn error: ${searchParams.get("error")}`, "error");
      setSearchParams({});
    }
  }, [searchParams, setSearchParams, showSnackbar]);

  useEffect(() => {
    async function loadAll() {
      setLoading(true);
      const [li, ai, st] = await Promise.allSettled([
        fetchLinkedInStatus(),
        fetchAiHealth(),
        fetchStats(),
      ]);
      setLinkedinStatus(li.status === "fulfilled" ? li.value : null);
      setAiHealth(
        ai.status === "fulfilled"
          ? ai.value
          : { healthy: false, error: "Cannot reach server" },
      );
      setStats(st.status === "fulfilled" ? st.value?.stats : null);
      setLoading(false);
    }
    loadAll();
  }, []);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5">Settings</Typography>
        <Typography variant="body2" color="text.secondary">
          Configure your connections and view system status
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <LinkedInConnect
            status={linkedinStatus}
            loading={loading}
            onStatusChange={setLinkedinStatus}
          />
        </Grid>

        <Grid item xs={12} md={5}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                System Status
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <List dense disablePadding>
                <ListItem disablePadding sx={{ mb: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <SmartToyIcon
                      fontSize="small"
                      sx={{
                        color: aiHealth?.healthy
                          ? "success.main"
                          : "error.main",
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Ollama / Gemma AI"
                    secondary={
                      aiHealth?.healthy
                        ? "Running"
                        : aiHealth?.error || "Not reachable"
                    }
                    primaryTypographyProps={{
                      variant: "body2",
                      fontWeight: 500,
                    }}
                    secondaryTypographyProps={{
                      variant: "caption",
                      color: aiHealth?.healthy ? "success.main" : "error.main",
                    }}
                  />
                  {aiHealth?.healthy ? (
                    <CheckCircleIcon fontSize="small" color="success" />
                  ) : (
                    <ErrorIcon fontSize="small" color="error" />
                  )}
                </ListItem>

                <ListItem disablePadding sx={{ mb: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <ImageIcon
                      fontSize="small"
                      sx={{
                        color: linkedinStatus?.unsplashConfigured
                          ? "success.main"
                          : "warning.main",
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Unsplash Images"
                    secondary={
                      linkedinStatus?.unsplashConfigured
                        ? "API key configured"
                        : "Add UNSPLASH_ACCESS_KEY to .env"
                    }
                    primaryTypographyProps={{
                      variant: "body2",
                      fontWeight: 500,
                    }}
                    secondaryTypographyProps={{
                      variant: "caption",
                      color: linkedinStatus?.unsplashConfigured
                        ? "success.main"
                        : "warning.main",
                    }}
                  />
                  {linkedinStatus?.unsplashConfigured ? (
                    <CheckCircleIcon fontSize="small" color="success" />
                  ) : (
                    <ErrorIcon fontSize="small" color="warning" />
                  )}
                </ListItem>

                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <ScheduleIcon
                      fontSize="small"
                      sx={{ color: "warning.main" }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Scheduler"
                    secondary="Runs every 6 hours (0 */6 * * *)"
                    primaryTypographyProps={{
                      variant: "body2",
                      fontWeight: 500,
                    }}
                    secondaryTypographyProps={{ variant: "caption" }}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {stats && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Post Statistics
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  {[
                    { label: "Total Generated", value: stats.total },
                    { label: "Successfully Posted", value: stats.posted },
                    { label: "Pending Approval", value: stats.pending },
                    { label: "Skipped", value: stats.skipped },
                  ].map((s) => (
                    <Grid item xs={6} sm={3} key={s.label}>
                      <Paper
                        sx={{
                          p: 2,
                          textAlign: "center",
                          bgcolor: "background.default",
                        }}
                      >
                        <Typography
                          variant="h5"
                          fontWeight={700}
                          color="primary.light"
                        >
                          {s.value}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {s.label}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Setup Checklist
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Alert severity="info" sx={{ mb: 2 }}>
                Complete these steps before your first post. Copy{" "}
                <code>.env.example</code> to <code>.env</code> in the server
                folder and fill in the values.
              </Alert>
              {[
                {
                  step: "Install Ollama",
                  url: "https://ollama.com/download",
                  done: aiHealth?.healthy,
                },
                {
                  step: "Pull Gemma: ollama pull gemma:2b",
                  url: null,
                  done: aiHealth?.healthy,
                },
                {
                  step: "Get free Unsplash API key",
                  url: "https://unsplash.com/developers",
                  done: linkedinStatus?.unsplashConfigured ?? null,
                },
                {
                  step: "Create LinkedIn Developer App",
                  url: "https://www.linkedin.com/developers/",
                  done: linkedinStatus?.configured,
                },
                {
                  step: "Connect LinkedIn OAuth (button above)",
                  url: null,
                  done: linkedinStatus?.connected,
                },
              ].map((item, i) => (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    py: 1,
                    borderBottom: i < 4 ? "1px solid" : "none",
                    borderColor: "divider",
                  }}
                >
                  {item.done === true ? (
                    <CheckCircleIcon fontSize="small" color="success" />
                  ) : item.done === false ? (
                    <ErrorIcon fontSize="small" color="warning" />
                  ) : (
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        border: "2px solid",
                        borderColor: "divider",
                      }}
                    />
                  )}
                  <Typography variant="body2" sx={{ flexGrow: 1 }}>
                    {item.step}
                  </Typography>
                  {item.url && (
                    <Chip
                      label="Open"
                      size="small"
                      component="a"
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      clickable
                      variant="outlined"
                      color="primary"
                    />
                  )}
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

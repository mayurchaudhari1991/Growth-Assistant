import React, { useState } from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Button,
  Chip,
  Divider,
  CircularProgress,
} from "@mui/material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import RefreshIcon from "@mui/icons-material/Refresh";
import { disconnectLinkedIn } from "../api/settings.api.js";

export default function LinkedInConnect({ status, loading, onStatusChange }) {
  const [disconnecting, setDisconnecting] = useState(false);

  const handleConnect = () => {
    window.location.href = "/auth/linkedin";
  };

  const handleDisconnect = async () => {
    setDisconnecting(true);
    try {
      await disconnectLinkedIn();
      if (onStatusChange)
        onStatusChange({
          configured: status?.configured,
          connected: false,
          personUrn: null,
        });
    } catch (e) {
      console.error("Disconnect failed", e);
    } finally {
      setDisconnecting(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
          <LinkedInIcon sx={{ color: "#0a66c2", fontSize: 32 }} />
          <Box>
            <Typography variant="subtitle1" fontWeight={600}>
              LinkedIn Connection
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Required to publish posts to your profile
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {loading ? (
          <Typography variant="body2" color="text.secondary">
            Checking connection status...
          </Typography>
        ) : (
          <>
            <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                >
                  App Configured
                </Typography>
                <Chip
                  size="small"
                  label={status?.configured ? "Yes" : "No"}
                  color={status?.configured ? "success" : "error"}
                  variant="outlined"
                />
              </Box>
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                >
                  OAuth Connected
                </Typography>
                <Chip
                  size="small"
                  icon={
                    status?.connected ? <CheckCircleIcon /> : <LinkOffIcon />
                  }
                  label={status?.connected ? "Connected" : "Not Connected"}
                  color={status?.connected ? "success" : "warning"}
                  variant="outlined"
                />
              </Box>
              {status?.personUrn && (
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    Account
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ fontFamily: "monospace" }}
                  >
                    {status.personUrn}
                  </Typography>
                </Box>
              )}
            </Box>

            {!status?.connected && (
              <>
                {!status?.configured && (
                  <Typography
                    variant="body2"
                    color="warning.main"
                    sx={{ mb: 2 }}
                  >
                    ⚠️ Add LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET to your
                    .env file first.
                  </Typography>
                )}
                <Button
                  variant="contained"
                  startIcon={<LinkedInIcon />}
                  onClick={handleConnect}
                  disabled={!status?.configured}
                  sx={{ bgcolor: "#0a66c2", "&:hover": { bgcolor: "#004182" } }}
                >
                  Connect LinkedIn Account
                </Button>
              </>
            )}

            {status?.connected && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  flexWrap: "wrap",
                }}
              >
                <Typography variant="body2" color="success.main">
                  ✅ Your LinkedIn account is connected. Posts will be published
                  to your profile.
                </Typography>
                <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={
                      disconnecting ? (
                        <CircularProgress size={14} />
                      ) : (
                        <LinkOffIcon />
                      )
                    }
                    onClick={handleDisconnect}
                    disabled={disconnecting}
                    color="error"
                  >
                    Disconnect
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<RefreshIcon />}
                    onClick={handleConnect}
                    color="primary"
                  >
                    Reconnect
                  </Button>
                </Box>
              </Box>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

import api from "../../../app/hooks/useApi.js";
import axios from "axios";

export const fetchLinkedInStatus = () =>
  axios.get("/auth/linkedin/status").then((r) => r.data);

export const disconnectLinkedIn = () =>
  axios.post("/auth/linkedin/disconnect").then((r) => r.data);

export const fetchAiHealth = () => api.get("/ai/health").then((r) => r.data);

export const fetchStats = () => api.get("/posts/stats").then((r) => r.data);

export const fetchSchedules = () => api.get("/schedules").then((r) => r.data);



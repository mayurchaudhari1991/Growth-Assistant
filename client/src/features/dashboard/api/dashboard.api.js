import api from "../../../app/hooks/useApi.js";

export const fetchPendingPosts = (page = 1) =>
  api.get(`/posts?status=pending&page=${page}&limit=10`).then((r) => r.data);

export const fetchStats = () =>
  api.get("/posts/stats").then((r) => r.data);

export const updatePost = (id, data) =>
  api.put(`/posts/${id}`, data).then((r) => r.data);

export const publishPost = (id) =>
  api.post(`/posts/${id}/publish`).then((r) => r.data);

export const skipPost = (id) =>
  api.patch(`/posts/${id}/skip`).then((r) => r.data);

export const deletePost = (id) =>
  api.delete(`/posts/${id}`).then((r) => r.data);

export const triggerPipeline = () =>
  api.post("/news/trigger").then((r) => r.data);

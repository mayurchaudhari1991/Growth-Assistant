import api from "../../../app/hooks/useApi.js";

export const fetchHistory = (status, page = 1) => {
  const params = new URLSearchParams({ page, limit: 15 });
  if (status && status !== "all") params.set("status", status);
  return api.get(`/posts?${params.toString()}`).then((r) => r.data);
};

export const deletePost = (id) =>
  api.delete(`/posts/${id}`).then((r) => r.data);

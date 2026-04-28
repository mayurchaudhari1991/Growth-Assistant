import { useState, useEffect, useCallback } from "react";
import { fetchPendingPosts, fetchStats } from "../api/content.api.js";


export default function usePendingPosts() {
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState({
    pending: 0,
    posted: 0,
    skipped: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const load = useCallback(async (p = 1) => {
    setLoading(true);
    setError(null);
    try {
      const [postData, statsData] = await Promise.all([
        fetchPendingPosts(p),
        fetchStats(),
      ]);
      setPosts(postData.posts);
      setTotalPages(postData.pages);
      setStats(statsData.stats);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(page);
  }, [load, page]);

  useEffect(() => {
    const handleCreated = () => load(1);
    window.addEventListener("post-created", handleCreated);
    return () => window.removeEventListener("post-created", handleCreated);
  }, [load]);

  const refresh = () => load(page);

  return { posts, stats, loading, error, page, setPage, totalPages, refresh };
}

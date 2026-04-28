import { useState, useEffect, useCallback } from "react";
import { fetchSchedules as apiFetchSchedules, updateSchedule as apiUpdateSchedule } from "../api/scheduler.api.js";

export default function useSchedules() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSchedules = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetchSchedules();
      setSchedules(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSchedule = async (id, data) => {
    try {
      const updated = await apiUpdateSchedule(id, data);
      setSchedules((prev) => 
        prev.map((s) => s._id === id ? updated : s)
      );
      return updated;

    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  return { schedules, loading, error, refresh: fetchSchedules, updateSchedule };
}

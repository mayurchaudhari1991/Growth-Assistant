import axios from "axios";

const API_BASE = "http://localhost:5000/api/schedules";

export const fetchSchedules = async () => {
  const response = await axios.get(API_BASE);
  return response.data.schedules;
};

export const updateSchedule = async (id, data) => {
  const response = await axios.put(`${API_BASE}/${id}`, data);
  return response.data.schedule;
};

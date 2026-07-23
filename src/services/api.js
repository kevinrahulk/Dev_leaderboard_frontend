import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
});

// range: "sprint" | "1m" | "3m" | "6m" | "all"
export async function fetchLeaderboard({ range, sprintId, startDate, endDate, limit }) {
  const params = { range };
  if (sprintId) params.sprint_id = sprintId;
  if (range === "custom") {
    params.start_date = startDate;
    params.end_date = endDate;
  }
  if (limit) params.limit = limit;

  const { data } = await api.get("/leaderboard", { params });
  return data;
}

export async function fetchSprints() {
  const { data } = await api.get("/sprints");
  return data;
}

export async function uploadCsv(file) {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await api.post("/import/csv", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function syncJira(jql) {
  const { data } = await api.post("/sync/jira", null, {
    params: jql ? { jql } : {},
  });
  return data;
}

export async function fetchEnvSettings() {
  const { data } = await api.get("/settings/env");
  return data;
}

export async function updateEnvSettings(payload) {
  const { data } = await api.post("/settings/env", payload);
  return data;
}

export async function testJiraConnection(payload) {
  const { data } = await api.post("/settings/jira/test", payload);
  return data;
}

export default api;


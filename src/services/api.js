import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
});

// fetchLeaderboard requires a projectId
export async function fetchLeaderboard({ projectId, range, sprintId, startDate, endDate, limit }) {
  if (!projectId) return null;
  const params = { project_id: projectId, range };
  if (sprintId) params.sprint_id = sprintId;
  if (range === "custom") {
    params.start_date = startDate;
    params.end_date = endDate;
  }
  if (limit) params.limit = limit;

  const { data } = await api.get("/leaderboard", { params });
  return data;
}

// fetchSprints requires a projectId
export async function fetchSprints(projectId) {
  const params = {};
  if (projectId) params.project_id = projectId;
  const { data } = await api.get("/sprints", { params });
  return data;
}

// uploadCsv requires a projectId
export async function uploadCsv(projectId, file) {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await api.post("/import/csv", formData, {
    params: { project_id: projectId },
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

// syncJira requires a projectId
export async function syncJira(projectId, jql) {
  const params = { project_id: projectId };
  if (jql) params.jql = jql;
  const { data } = await api.post("/sync/jira", null, { params });
  return data;
}

// Project Management Endpoints
export async function fetchProjects() {
  const { data } = await api.get("/projects");
  return data;
}

export async function createProject(payload) {
  const { data } = await api.post("/projects", payload);
  return data;
}

export async function updateProject(id, payload) {
  const { data } = await api.put(`/projects/${id}`, payload);
  return data;
}

export async function deleteProject(id) {
  const { data } = await api.delete(`/projects/${id}`);
  return data;
}

export async function testProjectConnection(id) {
  const { data } = await api.post(`/projects/${id}/test`);
  return data;
}

export default api;

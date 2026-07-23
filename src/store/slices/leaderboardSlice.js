import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchLeaderboard as fetchLeaderboardApi,
  fetchSprints as fetchSprintsApi,
  uploadCsv as uploadCsvApi,
  syncJira as syncJiraApi,
  fetchProjects as fetchProjectsApi,
  createProject as createProjectApi,
  updateProject as updateProjectApi,
  deleteProject as deleteProjectApi,
  testProjectConnection as testProjectConnectionApi,
} from "../../services/api";

// 1. Projects Thunks
export const getProjects = createAsyncThunk(
  "leaderboard/getProjects",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchProjectsApi();
      return data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.detail || "Failed to fetch projects.");
    }
  }
);

export const addProject = createAsyncThunk(
  "leaderboard/addProject",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const data = await createProjectApi(payload);
      dispatch(getProjects());
      return data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.detail || "Failed to create project.");
    }
  }
);

export const editProject = createAsyncThunk(
  "leaderboard/editProject",
  async ({ id, payload }, { dispatch, rejectWithValue }) => {
    try {
      const data = await updateProjectApi(id, payload);
      dispatch(getProjects());
      return data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.detail || "Failed to update project.");
    }
  }
);

export const removeProject = createAsyncThunk(
  "leaderboard/removeProject",
  async (id, { dispatch, getState, rejectWithValue }) => {
    try {
      const data = await deleteProjectApi(id);
      const state = getState().leaderboard;
      dispatch(getProjects());
      if (state.activeProjectId === id) {
        dispatch(setActiveProjectId(""));
      }
      return data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.detail || "Failed to delete project.");
    }
  }
);

export const testProject = createAsyncThunk(
  "leaderboard/testProject",
  async (id, { rejectWithValue }) => {
    try {
      const data = await testProjectConnectionApi(id);
      return data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.detail || "Failed to test connection.");
    }
  }
);

// 2. Sprint & Leaderboard Thunks
export const fetchSprints = createAsyncThunk(
  "leaderboard/fetchSprints",
  async (_, { getState, rejectWithValue }) => {
    try {
      const projectId = getState().leaderboard.activeProjectId;
      if (!projectId) return [];
      const data = await fetchSprintsApi(projectId);
      return data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.detail || "Failed to fetch sprints.");
    }
  }
);

export const fetchLeaderboard = createAsyncThunk(
  "leaderboard/fetchLeaderboard",
  async ({ range, sprintId, startDate, endDate, limit } = {}, { getState, rejectWithValue }) => {
    try {
      const state = getState().leaderboard;
      const projectId = state.activeProjectId;
      if (!projectId) return null;

      const targetRange = range || state.range;
      const targetSprintId = sprintId !== undefined ? sprintId : state.sprintId;

      if (targetRange === "sprint" && !targetSprintId) {
        return null;
      }

      const data = await fetchLeaderboardApi({
        projectId,
        range: targetRange,
        sprintId: targetSprintId,
        startDate,
        endDate,
        limit,
      });
      return data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.detail || "Could not load leaderboard data.");
    }
  }
);

export const uploadCsvFile = createAsyncThunk(
  "leaderboard/uploadCsvFile",
  async (file, { dispatch, getState, rejectWithValue }) => {
    try {
      const state = getState().leaderboard;
      const projectId = state.activeProjectId;
      if (!projectId) throw new Error("Please select a project first.");

      const summary = await uploadCsvApi(projectId, file);

      const sprintsRes = await dispatch(fetchSprints()).unwrap();
      const activeSprint = state.sprintId || (sprintsRes.length > 0 ? sprintsRes[0].id : null);

      dispatch(fetchLeaderboard({ range: state.range, sprintId: activeSprint }));

      return summary;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.detail || err.message || "Failed to upload CSV file.");
    }
  }
);

export const syncJiraData = createAsyncThunk(
  "leaderboard/syncJiraData",
  async (jql, { dispatch, getState, rejectWithValue }) => {
    try {
      const state = getState().leaderboard;
      const projectId = state.activeProjectId;
      if (!projectId) throw new Error("Please select a project first.");

      const summary = await syncJiraApi(projectId, jql);

      const sprintsRes = await dispatch(fetchSprints()).unwrap();
      const activeSprint = state.sprintId || (sprintsRes.length > 0 ? sprintsRes[0].id : null);

      dispatch(fetchLeaderboard({ range: state.range, sprintId: activeSprint }));

      return summary;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.detail || err.message || "Jira Sync failed.");
    }
  }
);

const leaderboardSlice = createSlice({
  name: "leaderboard",
  initialState: {
    projects: [],
    activeProjectId: "",
    projectsLoading: false,
    projectSaving: false,

    range: "1m",
    sprints: [],
    sprintId: "",
    data: null,
    loading: false,
    error: null,
    startDate: "",
    endDate: "",
    searchQuery: "",
    activeTab: 0, // 0: Leaderboard, 1: Settings
    themeMode: "dark",

    uploading: false,
    syncing: false,

    jiraTesting: false,
    jiraTestResult: null,

    bannerDismissed: false,

    snackbar: {
      open: false,
      message: "",
      severity: "info",
    },
  },
  reducers: {
    setActiveProjectId(state, action) {
      state.activeProjectId = action.payload;
      // Reset selected sprint when project changes
      state.sprintId = "";
      state.data = null;
    },
    setRange(state, action) {
      state.range = action.payload;
    },
    setSprintId(state, action) {
      state.sprintId = action.payload;
    },
    setCustomDates(state, action) {
      if (action.payload.startDate !== undefined) state.startDate = action.payload.startDate;
      if (action.payload.endDate !== undefined) state.endDate = action.payload.endDate;
    },
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
    setActiveTab(state, action) {
      state.activeTab = action.payload;
    },
    toggleThemeMode(state) {
      state.themeMode = state.themeMode === "dark" ? "light" : "dark";
    },
    dismissBanner(state) {
      state.bannerDismissed = true;
    },
    closeSnackbar(state) {
      state.snackbar.open = false;
    },
    showSnackbar(state, action) {
      state.snackbar = {
        open: true,
        message: action.payload.message,
        severity: action.payload.severity || "info",
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // getProjects
      .addCase(getProjects.pending, (state) => {
        state.projectsLoading = true;
      })
      .addCase(getProjects.fulfilled, (state, action) => {
        state.projectsLoading = false;
        state.projects = action.payload || [];
        if (state.projects.length > 0 && !state.activeProjectId) {
          state.activeProjectId = state.projects[0].id;
        }
      })
      .addCase(getProjects.rejected, (state, action) => {
        state.projectsLoading = false;
        state.snackbar = {
          open: true,
          message: action.payload,
          severity: "error",
        };
      })
      // addProject
      .addCase(addProject.pending, (state) => {
        state.projectSaving = true;
      })
      .addCase(addProject.fulfilled, (state, action) => {
        state.projectSaving = false;
        state.snackbar = {
          open: true,
          message: "Successfully configured new project!",
          severity: "success",
        };
      })
      .addCase(addProject.rejected, (state, action) => {
        state.projectSaving = false;
        state.snackbar = {
          open: true,
          message: action.payload,
          severity: "error",
        };
      })
      // editProject
      .addCase(editProject.pending, (state) => {
        state.projectSaving = true;
      })
      .addCase(editProject.fulfilled, (state) => {
        state.projectSaving = false;
        state.snackbar = {
          open: true,
          message: "Project updated successfully!",
          severity: "success",
        };
      })
      .addCase(editProject.rejected, (state, action) => {
        state.projectSaving = false;
        state.snackbar = {
          open: true,
          message: action.payload,
          severity: "error",
        };
      })
      // removeProject
      .addCase(removeProject.fulfilled, (state) => {
        state.snackbar = {
          open: true,
          message: "Project deleted successfully.",
          severity: "info",
        };
      })
      .addCase(removeProject.rejected, (state, action) => {
        state.snackbar = {
          open: true,
          message: action.payload,
          severity: "error",
        };
      })
      // testProject
      .addCase(testProject.pending, (state) => {
        state.jiraTesting = true;
        state.jiraTestResult = null;
      })
      .addCase(testProject.fulfilled, (state, action) => {
        state.jiraTesting = false;
        state.jiraTestResult = action.payload;
        state.snackbar = {
          open: true,
          message: action.payload.message,
          severity: action.payload.success ? "success" : "error",
        };
      })
      .addCase(testProject.rejected, (state, action) => {
        state.jiraTesting = false;
        state.jiraTestResult = { success: false, message: action.payload };
        state.snackbar = {
          open: true,
          message: action.payload,
          severity: "error",
        };
      })
      // fetchSprints
      .addCase(fetchSprints.fulfilled, (state, action) => {
        state.sprints = action.payload || [];
        if (state.sprints.length > 0 && !state.sprintId) {
          state.sprintId = state.sprints[0].id;
        }
      })
      // fetchLeaderboard
      .addCase(fetchLeaderboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.data = action.payload;
        }
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // uploadCsvFile
      .addCase(uploadCsvFile.pending, (state) => {
        state.uploading = true;
      })
      .addCase(uploadCsvFile.fulfilled, (state, action) => {
        state.uploading = false;
        const s = action.payload;
        state.snackbar = {
          open: true,
          message: `Successfully imported ${s.bugs_imported} bugs across ${s.developers_created} developers!`,
          severity: "success",
        };
      })
      .addCase(uploadCsvFile.rejected, (state, action) => {
        state.uploading = false;
        state.snackbar = {
          open: true,
          message: action.payload,
          severity: "error",
        };
      })
      // syncJiraData
      .addCase(syncJiraData.pending, (state) => {
        state.syncing = true;
      })
      .addCase(syncJiraData.fulfilled, (state, action) => {
        state.syncing = false;
        const s = action.payload;
        state.snackbar = {
          open: true,
          message: `Jira Sync complete: imported ${s.bugs_imported} bugs across ${s.developers_created} developers.`,
          severity: "success",
        };
      })
      .addCase(syncJiraData.rejected, (state, action) => {
        state.syncing = false;
        state.snackbar = {
          open: true,
          message: action.payload,
          severity: "error",
        };
      });
  },
});

export const {
  setActiveProjectId,
  setRange,
  setSprintId,
  setCustomDates,
  setSearchQuery,
  setActiveTab,
  toggleThemeMode,
  dismissBanner,
  closeSnackbar,
  showSnackbar,
} = leaderboardSlice.actions;

export default leaderboardSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchLeaderboard as fetchLeaderboardApi,
  fetchSprints as fetchSprintsApi,
  uploadCsv as uploadCsvApi,
  syncJira as syncJiraApi,
  fetchEnvSettings as fetchEnvSettingsApi,
  updateEnvSettings as updateEnvSettingsApi,
  testJiraConnection as testJiraConnectionApi,
} from "../../services/api";

export const fetchSprints = createAsyncThunk(
  "leaderboard/fetchSprints",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchSprintsApi();
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
      const targetRange = range || state.range;
      const targetSprintId = sprintId !== undefined ? sprintId : state.sprintId;

      if (targetRange === "sprint" && !targetSprintId) {
        return null;
      }

      const data = await fetchLeaderboardApi({
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
      const summary = await uploadCsvApi(file);

      const sprintsRes = await dispatch(fetchSprints()).unwrap();
      const state = getState().leaderboard;
      const activeSprint = state.sprintId || (sprintsRes.length > 0 ? sprintsRes[0].id : null);

      dispatch(fetchLeaderboard({ range: state.range, sprintId: activeSprint }));

      return summary;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.detail || "Failed to upload CSV file.");
    }
  }
);

export const syncJiraData = createAsyncThunk(
  "leaderboard/syncJiraData",
  async (jql, { dispatch, getState, rejectWithValue }) => {
    try {
      const summary = await syncJiraApi(jql);

      const sprintsRes = await dispatch(fetchSprints()).unwrap();
      const state = getState().leaderboard;
      const activeSprint = state.sprintId || (sprintsRes.length > 0 ? sprintsRes[0].id : null);

      dispatch(fetchLeaderboard({ range: state.range, sprintId: activeSprint }));

      return summary;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.detail || "Jira Sync failed.");
    }
  }
);

export const getEnvSettings = createAsyncThunk(
  "leaderboard/getEnvSettings",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchEnvSettingsApi();
      return data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.detail || "Failed to load environment settings.");
    }
  }
);

export const saveEnvSettings = createAsyncThunk(
  "leaderboard/saveEnvSettings",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await updateEnvSettingsApi(payload);
      return data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.detail || "Failed to save environment settings.");
    }
  }
);

export const testJira = createAsyncThunk(
  "leaderboard/testJira",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await testJiraConnectionApi(payload);
      return data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.detail || "Failed to test Jira connection.");
    }
  }
);

const leaderboardSlice = createSlice({
  name: "leaderboard",
  initialState: {
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

    envSettings: {
      JIRA_BASE_URL: "",
      JIRA_EMAIL: "",
      JIRA_API_TOKEN: "",
      JIRA_PROJECT_KEY: "",
    },
    envLoading: false,
    envSaving: false,
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
      })
      // getEnvSettings
      .addCase(getEnvSettings.pending, (state) => {
        state.envLoading = true;
      })
      .addCase(getEnvSettings.fulfilled, (state, action) => {
        state.envLoading = false;
        if (action.payload) {
          state.envSettings = action.payload;
        }
      })
      .addCase(getEnvSettings.rejected, (state, action) => {
        state.envLoading = false;
        state.snackbar = {
          open: true,
          message: action.payload,
          severity: "error",
        };
      })
      // saveEnvSettings
      .addCase(saveEnvSettings.pending, (state) => {
        state.envSaving = true;
      })
      .addCase(saveEnvSettings.fulfilled, (state, action) => {
        state.envSaving = false;
        if (action.payload) {
          state.envSettings = action.payload;
        }
        state.snackbar = {
          open: true,
          message: "Environment settings updated successfully in backend .env file!",
          severity: "success",
        };
      })
      .addCase(saveEnvSettings.rejected, (state, action) => {
        state.envSaving = false;
        state.snackbar = {
          open: true,
          message: action.payload,
          severity: "error",
        };
      })
      // testJira
      .addCase(testJira.pending, (state) => {
        state.jiraTesting = true;
        state.jiraTestResult = null;
      })
      .addCase(testJira.fulfilled, (state, action) => {
        state.jiraTesting = false;
        state.jiraTestResult = action.payload;
        state.snackbar = {
          open: true,
          message: action.payload.message,
          severity: action.payload.success ? "success" : "error",
        };
      })
      .addCase(testJira.rejected, (state, action) => {
        state.jiraTesting = false;
        state.jiraTestResult = { success: false, message: action.payload };
        state.snackbar = {
          open: true,
          message: action.payload,
          severity: "error",
        };
      });
  },
});

export const {
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



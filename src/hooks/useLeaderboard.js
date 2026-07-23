import { useEffect, useMemo, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "./reduxHooks";
import {
  fetchSprints,
  fetchLeaderboard,
  uploadCsvFile,
  syncJiraData,
  setRange,
  setSprintId,
  closeSnackbar,
} from "../store/slices/leaderboardSlice";

export function useLeaderboard() {
  const dispatch = useAppDispatch();
  const {
    activeProjectId,
    range,
    sprints,
    sprintId,
    startDate,
    endDate,
    data,
    loading,
    error,
    uploading,
    syncing,
    snackbar,
  } = useAppSelector((state) => state.leaderboard);

  // 1. Fetch sprints when active project changes
  useEffect(() => {
    if (activeProjectId) {
      dispatch(fetchSprints());
    }
  }, [dispatch, activeProjectId]);

  // 2. Fetch leaderboard when project, range, sprint, or dates change
  useEffect(() => {
    if (!activeProjectId) return;
    if (range === "custom" && (!startDate || !endDate)) return;
    dispatch(fetchLeaderboard({ range, sprintId, startDate, endDate }));
  }, [dispatch, activeProjectId, range, sprintId, startDate, endDate]);

  const handleRangeChange = useCallback(
    (newRange) => {
      if (newRange) dispatch(setRange(newRange));
    },
    [dispatch]
  );

  const handleSprintChange = useCallback(
    (newSprintId) => {
      dispatch(setSprintId(newSprintId));
    },
    [dispatch]
  );

  const handleUploadCsv = useCallback(
    (file) => {
      if (file) dispatch(uploadCsvFile(file));
    },
    [dispatch]
  );

  const handleSyncJira = useCallback(
    (jql) => {
      dispatch(syncJiraData(jql));
    },
    [dispatch]
  );

  const handleCloseSnackbar = useCallback(() => {
    dispatch(closeSnackbar());
  }, [dispatch]);

  const subtitle = useMemo(() => {
    if (!data) return "";
    const parts = [];
    if (data.sprint_id) {
      const s = sprints.find((sp) => sp.id === Number(data.sprint_id));
      if (s) parts.push(`Sprint: ${s.name}`);
      else parts.push(`Sprint #${data.sprint_id}`);
    }
    if (data.start_date && data.end_date) {
      const fmt = (d) => new Date(d).toLocaleDateString();
      parts.push(`${fmt(data.start_date)} – ${fmt(data.end_date)}`);
    }
    return parts.join(" • ");
  }, [data, sprints]);

  return {
    range,
    sprints,
    sprintId,
    data,
    loading,
    error,
    uploading,
    syncing,
    snackbar,
    subtitle,
    handleRangeChange,
    handleSprintChange,
    handleUploadCsv,
    handleSyncJira,
    handleCloseSnackbar,
  };
}

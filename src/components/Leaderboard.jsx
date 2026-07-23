import { useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Avatar,
  Chip,
  CircularProgress,
  Alert,
  Stack,
  Button,
  TextField,
  InputAdornment,
  Tooltip,
  LinearProgress,
  useTheme,
  Card,
  CardContent,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import SyncIcon from "@mui/icons-material/Sync";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import { useLeaderboard } from "../hooks/useLeaderboard";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { setSearchQuery, setCustomDates } from "../store/slices/leaderboardSlice";
import Podium from "./Podium";
import BugChart from "./BugChart";

const RANGE_OPTIONS = [
  { value: "1m", label: "Last 1 Month" },
  { value: "3m", label: "Last 3 Months" },
  { value: "6m", label: "Last 6 Months" },
  { value: "all", label: "All Time" },
  { value: "custom", label: "Custom Range" },
];

function rankColor(rank) {
  if (rank === 1) return "#10B981"; // Emerald Gold Star
  if (rank === 2) return "#3B82F6"; // Blue
  if (rank === 3) return "#F59E0B"; // Amber
  return "#64748B"; // Slate
}

function rankLabel(rank) {
  if (rank === 1) return "🥇 Star #1";
  if (rank === 2) return "🥈 Star #2";
  if (rank === 3) return "🥉 Star #3";
  return `#${rank}`;
}

function initials(name = "") {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatResolutionTime(seconds) {
  if (seconds === null || seconds === undefined) return "No bugs resolved";
  const hours = seconds / 3600;
  if (hours < 1) {
    const mins = Math.round(seconds / 60);
    return `${mins} min${mins === 1 ? "" : "s"} avg fix time`;
  }
  if (hours < 24) {
    return `${hours.toFixed(1)} hr${hours.toFixed(1) === "1.0" ? "" : "s"} avg fix time`;
  }
  const days = hours / 24;
  return `${days.toFixed(1)} day${days.toFixed(1) === "1.0" ? "" : "s"} avg fix time`;
}

export default function Leaderboard() {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector((state) => state.leaderboard.searchQuery);
  const startDate = useAppSelector((state) => state.leaderboard.startDate);
  const endDate = useAppSelector((state) => state.leaderboard.endDate);

  const {
    range,
    sprints,
    sprintId,
    data,
    loading,
    error,
    uploading,
    syncing,
    subtitle,
    handleRangeChange,
    handleSprintChange,
    handleUploadCsv,
    handleSyncJira,
  } = useLeaderboard();

  const [sprintOpen, setSprintOpen] = useState(false);

  const onFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      handleUploadCsv(file);
      event.target.value = "";
    }
  };

  const filteredEntries =
    data?.entries?.filter((e) =>
      e.name.toLowerCase().includes((searchQuery || "").toLowerCase())
    ) || [];

  const maxBugs = data?.entries?.reduce((max, e) => Math.max(max, e.bug_count), 1) || 1;

  return (
    <Box>
      {/* Top Controls Header */}
      <Paper variant="outlined" sx={{ p: 2.5, mb: 3, borderRadius: 3 }}>
        {/* Row 1: Timeframe Mode Buttons & Action Buttons */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", md: "center" }}
          spacing={2}
        >
          <Tooltip title="Filter bug count rankings by timeframe duration" arrow placement="top">
            <ToggleButtonGroup
              value={range}
              exclusive
              size="small"
              onChange={(_, val) => val && handleRangeChange(val)}
              color="primary"
              sx={{ flexWrap: "wrap" }}
            >
              {RANGE_OPTIONS.map((opt) => (
                <ToggleButton key={opt.value} value={opt.value} sx={{ fontWeight: 600, px: 2 }}>
                  {opt.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Tooltip>

          {/* Action Buttons: Import & Sync */}
          <Stack direction="row" spacing={1.5} justifyContent="flex-end">
            <Tooltip title="Import bug export CSV file directly from Jira" arrow>
              <Button
                component="label"
                variant="contained"
                color="primary"
                size="medium"
                startIcon={uploading ? <CircularProgress size={18} color="inherit" /> : <UploadFileIcon />}
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Upload CSV"}
                <input type="file" accept=".csv" hidden onChange={onFileChange} />
              </Button>
            </Tooltip>

            <Tooltip title="Pull live bug issues directly from configured Jira REST API" arrow>
              <Button
                variant="outlined"
                color="primary"
                size="medium"
                startIcon={syncing ? <CircularProgress size={18} color="inherit" /> : <SyncIcon />}
                disabled={syncing}
                onClick={() => handleSyncJira()}
              >
                {syncing ? "Syncing Jira..." : "Sync Jira"}
              </Button>
            </Tooltip>
          </Stack>
        </Stack>

        {/* Row 2: Sprint Selector & Custom Date Filters */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems="center"
          sx={{ mt: 2, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}
        >
          <Tooltip title="Filter by a specific development sprint or select All Sprints" arrow placement="top" open={sprintOpen ? false : undefined}>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel id="sprint-select-label">Sprint Filter</InputLabel>
              <Select
                labelId="sprint-select-label"
                label="Sprint Filter"
                value={sprintId || ""}
                onOpen={() => setSprintOpen(true)}
                onClose={() => setSprintOpen(false)}
                onChange={(e) => handleSprintChange(e.target.value)}
              >
                <MenuItem value="">
                  <em>All Sprints</em>
                </MenuItem>
                {sprints.map((s) => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Tooltip>

          {range === "custom" && (
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Tooltip title="Select Start Date for custom range" arrow placement="top">
                <TextField
                  type="date"
                  size="small"
                  label="Start Date"
                  InputLabelProps={{ shrink: true }}
                  value={startDate}
                  onChange={(e) => dispatch(setCustomDates({ startDate: e.target.value }))}
                  sx={{ minWidth: 160 }}
                />
              </Tooltip>
              <Tooltip title="Select End Date for custom range" arrow placement="top">
                <TextField
                  type="date"
                  size="small"
                  label="End Date"
                  InputLabelProps={{ shrink: true }}
                  value={endDate}
                  onChange={(e) => dispatch(setCustomDates({ endDate: e.target.value }))}
                  sx={{ minWidth: 160 }}
                />
              </Tooltip>
            </Stack>
          )}
        </Stack>

        {/* Search Bar & Subtitle */}
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems="center" spacing={2} sx={{ mt: 2.5, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Scoring Rule:</strong> Lower bug assignment count yields higher Star rank. {subtitle}
          </Typography>

          <TextField
            size="small"
            placeholder="Search developer..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ width: { xs: "100%", sm: 260 } }}
          />
        </Stack>
      </Paper>

      {/* Top 3 Podium Visualizer */}
      {!loading && !error && <Podium />}

      {/* Backlog Distribution Bar Chart */}
      {!loading && !error && <BugChart />}

      {/* Loading Indicator */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress size={36} />
        </Box>
      )}

      {/* Error Alert */}
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {/* Leaderboard Table / Cards */}
      {!loading && !error && data && (
        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell width={110}>Rank</TableCell>
                <TableCell>Software Engineer</TableCell>
                <TableCell width={240}>Bug Burden Progress</TableCell>
                <TableCell align="right" width={110}>Total Bugs</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEntries.map((entry) => {
                const bugPercent = (entry.bug_count / maxBugs) * 100;
                const isRank1 = entry.rank === 1;

                return (
                  <TableRow
                    key={entry.developer_id}
                    hover
                    sx={{
                      bgcolor: isRank1
                        ? theme.palette.mode === "dark"
                          ? "rgba(16, 185, 129, 0.06)"
                          : "rgba(16, 185, 129, 0.04)"
                        : "inherit",
                    }}
                  >
                    <TableCell>
                      <Tooltip title={`Rank #${entry.rank}`} arrow>
                        <Chip
                          label={rankLabel(entry.rank)}
                          size="small"
                          sx={{
                            bgcolor: rankColor(entry.rank),
                            color: "#fff",
                            fontWeight: 700,
                            px: 0.5,
                          }}
                        />
                      </Tooltip>
                    </TableCell>

                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar
                          src={entry.avatar_url || undefined}
                          sx={{
                            width: 36,
                            height: 36,
                            fontSize: 14,
                            bgcolor: rankColor(entry.rank),
                            color: "#fff",
                          }}
                        >
                          {initials(entry.name)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600} sx={{ lineHeight: 1.2 }}>
                            {entry.name}
                          </Typography>
                          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.25 }}>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                              {formatResolutionTime(entry.avg_resolution_time)}
                            </Typography>
                            {isRank1 && (
                              <Typography variant="caption" color="success.main" sx={{ fontWeight: 700 }}>
                                • 👑 Star Holder #1
                              </Typography>
                            )}
                          </Stack>
                        </Box>
                      </Stack>
                    </TableCell>

                    <TableCell>
                      <Tooltip title={`${entry.bug_count} out of maximum ${maxBugs} bugs`} arrow>
                        <Box sx={{ width: "100%", pr: 2 }}>
                          <LinearProgress
                            variant="determinate"
                            value={bugPercent}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              bgcolor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
                              "& .MuiLinearProgress-bar": {
                                borderRadius: 4,
                                bgcolor: rankColor(entry.rank),
                              },
                            }}
                          />
                        </Box>
                      </Tooltip>
                    </TableCell>

                    <TableCell align="right">
                      <Chip
                        label={entry.bug_count}
                        size="small"
                        variant="outlined"
                        sx={{ fontWeight: 700, minWidth: 40 }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}

              {filteredEntries.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                      No software engineers found matching search criteria or timeframe.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

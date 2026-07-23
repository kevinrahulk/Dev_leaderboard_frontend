import { Grid, Paper, Box, Typography, Stack, Avatar, Tooltip } from "@mui/material";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import BugReportIcon from "@mui/icons-material/BugReport";
import GroupsIcon from "@mui/icons-material/Groups";
import DateRangeIcon from "@mui/icons-material/DateRange";
import { useAppSelector } from "../hooks/reduxHooks";

export default function KpiCards() {
  const { data, range, sprints, sprintId } = useAppSelector((state) => state.leaderboard);

  const topDev = data?.entries && data.entries.length > 0 ? data.entries[0] : null;
  const totalBugs = data?.entries
    ? data.entries.reduce((acc, curr) => acc + curr.bug_count, 0)
    : 0;
  const totalDevs = data?.total_developers || 0;

  const currentSprintName =
    range === "sprint"
      ? sprints.find((s) => s.id === Number(sprintId))?.name || "Active Sprint"
      : range.toUpperCase();

  return (
    <Grid container spacing={2.5} sx={{ mb: 3 }}>
      {/* KPI 1: Star Developer */}
      <Grid item xs={12} sm={6} md={3}>
        <Tooltip title="Rank 1 Developer with the lowest bug burden for this period" arrow>
          <Paper
            variant="outlined"
            sx={{
              p: 2.5,
              height: "100%",
              borderColor: "rgba(245, 158, 11, 0.4)",
              background: "linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(217, 119, 6, 0.03) 100%)",
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
                  Top Star Developer
                </Typography>
                <Typography variant="h6" sx={{ mt: 0.5, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {topDev ? topDev.name : "N/A"}
                </Typography>
                <Typography variant="body2" color="warning.main" fontWeight={600}>
                  {topDev ? `${topDev.bug_count} ${topDev.bug_count === 1 ? "bug" : "bugs"}` : "No data"}
                </Typography>
              </Box>
              <Avatar
                src={topDev?.avatar_url || undefined}
                sx={{
                  width: 44,
                  height: 44,
                  bgcolor: "#F59E0B",
                  color: "#FFF",
                  boxShadow: "0 4px 10px rgba(245, 158, 11, 0.3)",
                }}
              >
                <WorkspacePremiumIcon />
              </Avatar>
            </Stack>
          </Paper>
        </Tooltip>
      </Grid>

      {/* KPI 2: Total Bugs */}
      <Grid item xs={12} sm={6} md={3}>
        <Tooltip title="Total number of bug tickets logged across all developers in this range" arrow>
          <Paper variant="outlined" sx={{ p: 2.5, height: "100%" }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
                  Total Bugs Tracked
                </Typography>
                <Typography variant="h4" sx={{ mt: 0.5, fontWeight: 800 }}>
                  {totalBugs}
                </Typography>
              </Box>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2,
                  bgcolor: "rgba(239, 68, 68, 0.12)",
                  color: "#EF4444",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <BugReportIcon />
              </Box>
            </Stack>
          </Paper>
        </Tooltip>
      </Grid>

      {/* KPI 3: Total Engineers */}
      <Grid item xs={12} sm={6} md={3}>
        <Tooltip title="Number of active software developers included on the leaderboard" arrow>
          <Paper variant="outlined" sx={{ p: 2.5, height: "100%" }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
                  Active Engineers
                </Typography>
                <Typography variant="h4" sx={{ mt: 0.5, fontWeight: 800 }}>
                  {totalDevs}
                </Typography>
              </Box>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2,
                  bgcolor: "rgba(99, 102, 241, 0.12)",
                  color: "#6366F1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <GroupsIcon />
              </Box>
            </Stack>
          </Paper>
        </Tooltip>
      </Grid>

      {/* KPI 4: Timeframe */}
      <Grid item xs={12} sm={6} md={3}>
        <Tooltip title="Currently selected evaluation range or sprint" arrow>
          <Paper variant="outlined" sx={{ p: 2.5, height: "100%" }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
                  Timeframe Period
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ mt: 0.5, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                >
                  {currentSprintName}
                </Typography>
              </Box>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2,
                  bgcolor: "rgba(16, 185, 129, 0.12)",
                  color: "#10B981",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <DateRangeIcon />
              </Box>
            </Stack>
          </Paper>
        </Tooltip>
      </Grid>
    </Grid>
  );
}

import { Box, Paper, Typography, Stack, Tooltip, useTheme } from "@mui/material";
import { useAppSelector } from "../hooks/reduxHooks";

const CHART_COLORS = [
  "#10B981", // Emerald
  "#3B82F6", // Blue
  "#F59E0B", // Amber
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#06B6D4", // Cyan
  "#14B8A6", // Teal
  "#F97316", // Orange
  "#64748B", // Slate
];

export default function BugChart() {
  const theme = useTheme();
  const data = useAppSelector((state) => state.leaderboard.data);

  if (!data?.entries || data.entries.length === 0) return null;

  const totalBugs = data.entries.reduce((sum, entry) => sum + entry.bug_count, 0);
  if (totalBugs === 0) return null;

  return (
    <Paper variant="outlined" sx={{ p: 2.5, mb: 3, borderRadius: 2 }}>
      <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
        Bug Backlog Distribution Share
      </Typography>

      {/* Stacked Percentage Bar Chart */}
      <Box
        sx={{
          display: "flex",
          height: 20,
          width: "100%",
          borderRadius: 1,
          overflow: "hidden",
          bgcolor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
          mb: 2,
        }}
      >
        {data.entries.map((entry, index) => {
          const percentage = (entry.bug_count / totalBugs) * 100;
          const color = CHART_COLORS[index % CHART_COLORS.length];

          return (
            <Tooltip
              key={entry.developer_id}
              title={`${entry.name}: ${entry.bug_count} bugs (${percentage.toFixed(0)}%)`}
              arrow
              placement="top"
            >
              <Box
                sx={{
                  width: `${percentage}%`,
                  height: "100%",
                  backgroundColor: color,
                  transition: "width 0.5s ease-in-out",
                  cursor: "pointer",
                  "&:hover": {
                    opacity: 0.85,
                    filter: "brightness(1.1)",
                  },
                }}
              />
            </Tooltip>
          );
        })}
      </Box>

      {/* Legend Stack */}
      <Stack
        direction="row"
        spacing={2}
        useFlexGap
        flexWrap="wrap"
        justifyContent="flex-start"
        alignItems="center"
      >
        {data.entries.map((entry, index) => {
          const percentage = (entry.bug_count / totalBugs) * 100;
          const color = CHART_COLORS[index % CHART_COLORS.length];

          return (
            <Stack
              key={entry.developer_id}
              direction="row"
              spacing={0.75}
              alignItems="center"
              sx={{ minWidth: 100, py: 0.25 }}
            >
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor: color,
                }}
              />
              <Typography variant="caption" fontWeight={600} noWrap sx={{ maxWidth: 120 }}>
                {entry.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ({percentage.toFixed(0)}%)
              </Typography>
            </Stack>
          );
        })}
      </Stack>
    </Paper>
  );
}

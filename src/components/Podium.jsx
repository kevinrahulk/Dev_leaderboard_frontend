import { Box, Grid, Paper, Typography, Avatar, Stack, Chip, Tooltip, useTheme } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import StarIcon from "@mui/icons-material/Star";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import { useAppSelector } from "../hooks/reduxHooks";

function initials(name = "") {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function Podium() {
  const theme = useTheme();
  const data = useAppSelector((state) => state.leaderboard.data);

  if (!data?.entries || data.entries.length < 1) return null;

  const top3 = data.entries.slice(0, 3);
  const rank1 = top3.find((e) => e.rank === 1) || top3[0];
  const rank2 = top3.find((e) => e.rank === 2) || top3[1];
  const rank3 = top3.find((e) => e.rank === 3) || top3[2];

  // Reorder for traditional podium display: 2nd place (left), 1st place (center), 3rd place (right)
  const podiumList = [];
  if (rank2) podiumList.push({ ...rank2, color: "#3B82F6", title: "Silver Star", height: 160, order: 1 });
  if (rank1) podiumList.push({ ...rank1, color: "#10B981", title: "Gold Star Champion", height: 190, isGold: true, order: 2 });
  if (rank3) podiumList.push({ ...rank3, color: "#F59E0B", title: "Bronze Star", height: 140, order: 3 });

  // Sort by order so center is rank 1 on desktop
  podiumList.sort((a, b) => a.order - b.order);

  return (
    <Box sx={{ mb: 4 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <EmojiEventsIcon sx={{ color: "#F59E0B", fontSize: 24 }} />
        <Typography variant="h6" fontWeight={700}>
          Top Performers Podium
        </Typography>
        <Tooltip title="Engineers with the fewest assigned bugs win Star Holder honors">
          <Chip label="Fewest Bugs = Top Rank" size="small" variant="outlined" sx={{ fontWeight: 600 }} />
        </Tooltip>
      </Stack>

      <Grid container spacing={2.5} alignItems="flex-end">
        {podiumList.map((entry) => (
          <Grid
            item
            xs={12}
            sm={4}
            key={entry.developer_id}
            sx={{
              order: entry.isGold ? { xs: 1, sm: 2 } : entry.rank === 2 ? { xs: 2, sm: 1 } : { xs: 3, sm: 3 },
            }}
          >
            <Tooltip title={`${entry.name} - Rank #${entry.rank} with ${entry.bug_count} bugs`} arrow>
              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                  textAlign: "center",
                  borderRadius: 2,
                  position: "relative",
                  borderColor: entry.isGold ? "rgba(16, 185, 129, 0.5)" : "rgba(148, 163, 184, 0.2)",
                  background: entry.isGold
                    ? theme.palette.mode === "dark"
                      ? "linear-gradient(180deg, rgba(16, 185, 129, 0.15) 0%, rgba(30, 41, 59, 0.9) 100%)"
                      : "linear-gradient(180deg, rgba(16, 185, 129, 0.08) 0%, #FFFFFF 100%)"
                    : theme.palette.background.paper,
                  boxShadow: entry.isGold
                    ? "0 10px 25px -5px rgba(16, 185, 129, 0.3)"
                    : "0 4px 12px rgba(0,0,0,0.05)",
                  transform: entry.isGold ? "scale(1.03)" : "scale(1)",
                  transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                  "&:hover": {
                    transform: entry.isGold ? "scale(1.05)" : "scale(1.02)",
                  },
                }}
              >
                {/* Crown / Star Badge */}
                <Box
                  sx={{
                    position: "absolute",
                    top: -16,
                    left: "50%",
                    transform: "translateX(-50%)",
                    bgcolor: entry.color,
                    color: "#FFF",
                    px: 1.5,
                    py: 0.25,
                    borderRadius: 1,
                    boxShadow: `0 4px 10px ${entry.color}66`,
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  <StarIcon sx={{ fontSize: 16 }} />
                  <Typography variant="caption" fontWeight={800}>
                    #{entry.rank} {entry.title}
                  </Typography>
                </Box>

                {/* Avatar with Glow Ring */}
                <Box sx={{ mt: 1, mb: 1.5, display: "inline-block", position: "relative" }}>
                  <Avatar
                    src={entry.avatar_url || undefined}
                    sx={{
                      width: entry.isGold ? 64 : 54,
                      height: entry.isGold ? 64 : 54,
                      mx: "auto",
                      border: `3px solid ${entry.color}`,
                      fontSize: entry.isGold ? 20 : 16,
                      fontWeight: 700,
                      bgcolor: entry.color,
                      color: "#FFF",
                    }}
                  >
                    {initials(entry.name)}
                  </Avatar>
                </Box>

                <Typography variant="subtitle1" fontWeight={700} noWrap>
                  {entry.name}
                </Typography>

                <Chip
                  label={`${entry.bug_count} ${entry.bug_count === 1 ? "bug" : "bugs"}`}
                  size="small"
                  sx={{
                    mt: 1,
                    fontWeight: 700,
                    bgcolor: entry.isGold ? "success.main" : entry.color,
                    color: "#FFF",
                  }}
                />
              </Paper>
            </Tooltip>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

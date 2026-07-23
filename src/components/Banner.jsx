import { Alert, Box, Button, IconButton, Collapse, Stack, Typography, Chip, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import TuneIcon from "@mui/icons-material/Tune";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { dismissBanner, setActiveTab } from "../store/slices/leaderboardSlice";

export default function Banner() {
  const dispatch = useAppDispatch();
  const bannerDismissed = useAppSelector((state) => state.leaderboard.bannerDismissed);

  if (bannerDismissed) return null;

  return (
    <Box sx={{ mb: 3 }}>
      <Box
        sx={{
          p: 2,
          borderRadius: 3,
          background: "linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)",
          border: "1px solid rgba(99, 102, 241, 0.3)",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              bgcolor: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              color: "#FFF",
            }}
          >
            <AutoAwesomeIcon />
          </Box>
          <Box>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
              <Typography variant="subtitle1" fontWeight={700}>
                Welcome to StarHolder Platform!
              </Typography>
              <Chip label="NEW" color="secondary" size="small" sx={{ height: 18, fontSize: 10 }} />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Fewer assigned bugs = Higher Star Rank. You can directly update backend <code>.env</code> variables, test Jira credentials, or import CSV exports.
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          <Tooltip title="Configure backend environment credentials directly in frontend">
            <Button
              variant="outlined"
              size="small"
              startIcon={<TuneIcon />}
              onClick={() => dispatch(setActiveTab(1))}
              sx={{ borderRadius: 2 }}
            >
              Configure .env
            </Button>
          </Tooltip>
          <IconButton size="small" onClick={() => dispatch(dismissBanner())}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Box>
    </Box>
  );
}

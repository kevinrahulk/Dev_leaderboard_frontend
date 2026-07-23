import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Stack,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  Chip,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import SettingsIcon from "@mui/icons-material/Settings";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import CloudDoneIcon from "@mui/icons-material/CloudDone";
import CloudOffIcon from "@mui/icons-material/CloudOff";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { setActiveTab, toggleThemeMode, setActiveProjectId } from "../store/slices/leaderboardSlice";

export default function Header() {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { activeTab, themeMode, projects, activeProjectId } = useAppSelector(
    (state) => state.leaderboard
  );

  const activeProject = projects.find((p) => p.id === activeProjectId);
  const isJiraConnected = Boolean(
    activeProject?.jira_base_url && activeProject?.jira_api_token
  );

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
        color: theme.palette.text.primary,
        backdropFilter: "blur(8px)",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", flexWrap: "wrap", py: 1, px: { xs: 2, sm: 4 } }}>
        {/* Logo & Branding */}
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "6px",
              background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(245, 158, 11, 0.35)",
            }}
          >
            <StarIcon sx={{ color: "#FFF", fontSize: 26 }} />
          </Box>
          <Box>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  background: "linear-gradient(135deg, #6366F1 0%, #A855F7 50%, #EC4899 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: "-0.02em",
                }}
              >
                StarHolder
              </Typography>
              <Chip
                label="v3.0"
                size="small"
                sx={{
                  height: 20,
                  fontSize: 10,
                  fontWeight: 700,
                  bgcolor: theme.palette.mode === "dark" ? "rgba(99, 102, 241, 0.2)" : "rgba(99, 102, 241, 0.1)",
                  color: theme.palette.primary.main,
                }}
              />
            </Stack>
            <Typography variant="caption" color="text.secondary" sx={{ display: { xs: "none", sm: "block" } }}>
              Multi-Project Quality Leaderboard Platform
            </Typography>
          </Box>
        </Stack>

        {/* Project Selector & Navigation Tabs */}
        <Stack direction="row" alignItems="center" spacing={3}>
          {projects.length > 0 && (
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel id="project-select-label">Active Project</InputLabel>
              <Select
                labelId="project-select-label"
                value={activeProjectId}
                label="Active Project"
                onChange={(e) => dispatch(setActiveProjectId(e.target.value))}
                sx={{
                  fontWeight: 600,
                  bgcolor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
                }}
              >
                {projects.map((proj) => (
                  <MenuItem key={proj.id} value={proj.id} sx={{ fontWeight: 500 }}>
                    {proj.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <Tabs
            value={activeTab}
            onChange={(_, val) => dispatch(setActiveTab(val))}
            textColor="primary"
            indicatorColor="primary"
            sx={{
              minHeight: 44,
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 600,
                fontSize: 15,
                minHeight: 44,
                px: 2,
              },
            }}
          >
            <Tab
              icon={<LeaderboardIcon sx={{ fontSize: 20 }} />}
              iconPosition="start"
              label="Leaderboard"
              id="tab-leaderboard"
            />
            <Tab
              icon={<SettingsIcon sx={{ fontSize: 20 }} />}
              iconPosition="start"
              label="Settings"
              id="tab-settings"
            />
          </Tabs>
        </Stack>

        {/* Action Controls & Theme Switcher */}
        <Stack direction="row" alignItems="center" spacing={1.5}>
          {projects.length > 0 && (
            <Tooltip
              title={
                isJiraConnected
                  ? `Jira Sync available for ${activeProject?.name}`
                  : "Sync unavailable - pending credentials in Settings"
              }
            >
              <Chip
                icon={isJiraConnected ? <CloudDoneIcon sx={{ fontSize: 16 }} /> : <CloudOffIcon sx={{ fontSize: 16 }} />}
                label={isJiraConnected ? "Jira Active" : "Jira Inactive"}
                size="small"
                color={isJiraConnected ? "success" : "default"}
                variant={isJiraConnected ? "filled" : "outlined"}
                sx={{ fontWeight: 600, display: { xs: "none", sm: "inline-flex" } }}
              />
            </Tooltip>
          )}

          <Tooltip title={themeMode === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}>
            <IconButton
              onClick={() => dispatch(toggleThemeMode())}
              sx={{
                bgcolor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              {themeMode === "dark" ? (
                <LightModeIcon sx={{ color: "#F59E0B" }} />
              ) : (
                <DarkModeIcon sx={{ color: "#6366F1" }} />
              )}
            </IconButton>
          </Tooltip>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

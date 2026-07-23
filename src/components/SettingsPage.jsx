import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Stack,
  InputAdornment,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  Divider,
  Chip,
  Card,
  CardContent,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import SaveIcon from "@mui/icons-material/Save";
import KeyIcon from "@mui/icons-material/Key";
import StorageIcon from "@mui/icons-material/Storage";
import ConnectionIcon from "@mui/icons-material/NetworkCheck";
import InfoIcon from "@mui/icons-material/Info";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { getEnvSettings, saveEnvSettings, testJira } from "../store/slices/leaderboardSlice";

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const { envSettings, envLoading, envSaving, jiraTesting, jiraTestResult } = useAppSelector(
    (state) => state.leaderboard
  );

  const [formValues, setFormValues] = useState({
    JIRA_BASE_URL: "",
    JIRA_EMAIL: "",
    JIRA_API_TOKEN: "",
    JIRA_PROJECT_KEY: "",
  });

  const [showToken, setShowToken] = useState(false);

  useEffect(() => {
    dispatch(getEnvSettings());
  }, [dispatch]);

  useEffect(() => {
    if (envSettings) {
      setFormValues({
        JIRA_BASE_URL: envSettings.JIRA_BASE_URL || "",
        JIRA_EMAIL: envSettings.JIRA_EMAIL || "",
        JIRA_API_TOKEN: envSettings.JIRA_API_TOKEN || "",
        JIRA_PROJECT_KEY: envSettings.JIRA_PROJECT_KEY || "",
      });
    }
  }, [envSettings]);

  const handleChange = (field) => (e) => {
    setFormValues({ ...formValues, [field]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    dispatch(saveEnvSettings(formValues));
  };

  const handleTestJiraConnection = () => {
    dispatch(testJira(formValues));
  };

  return (
    <Box sx={{ maxWidth: 880, mx: "auto", py: 2 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Box>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h5" fontWeight={700}>
              Jira & Environment Settings
            </Typography>
            <Chip label="backend/.env" color="primary" variant="outlined" size="small" />
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Directly update backend Jira API credentials and project settings.
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          startIcon={envSaving ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
          onClick={handleSave}
          disabled={envSaving || envLoading}
        >
          {envSaving ? "Saving .env..." : "Save Settings"}
        </Button>
      </Stack>

      {envLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <form onSubmit={handleSave}>
          <Grid container spacing={3}>
            {/* Jira Integration Section */}
            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 2,
                        bgcolor: "rgba(59, 130, 246, 0.12)",
                        color: "#3B82F6",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <KeyIcon fontSize="small" />
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight={700}>
                        Jira REST API Credentials
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Used to fetch live bug tickets and sync sprint statistics
                      </Typography>
                    </Box>
                  </Stack>

                  <Tooltip title="Test whether provided Jira credentials can authenticate and fetch tickets" arrow>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={jiraTesting ? <CircularProgress size={16} color="inherit" /> : <ConnectionIcon />}
                      onClick={handleTestJiraConnection}
                      disabled={jiraTesting}
                    >
                      {jiraTesting ? "Testing Jira..." : "Test Jira Connection"}
                    </Button>
                  </Tooltip>
                </Stack>

                {jiraTestResult && (
                  <Alert
                    severity={jiraTestResult.success ? "success" : "error"}
                    icon={jiraTestResult.success ? <CheckCircleIcon /> : <ErrorIcon />}
                    sx={{ mb: 3 }}
                  >
                    {jiraTestResult.message}
                  </Alert>
                )}

                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={6}>
                    <Tooltip title="Your Atlassian Jira domain instance URL (e.g. https://yourcompany.atlassian.net)" arrow placement="top">
                      <TextField
                        fullWidth
                        label="JIRA_BASE_URL"
                        placeholder="https://company.atlassian.net"
                        value={formValues.JIRA_BASE_URL}
                        onChange={handleChange("JIRA_BASE_URL")}
                        size="small"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <HelpOutlineIcon fontSize="small" color="disabled" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Tooltip>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Tooltip title="Atlassian account email address associated with your API token" arrow placement="top">
                      <TextField
                        fullWidth
                        label="JIRA_EMAIL"
                        placeholder="developer@company.com"
                        value={formValues.JIRA_EMAIL}
                        onChange={handleChange("JIRA_EMAIL")}
                        size="small"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <HelpOutlineIcon fontSize="small" color="disabled" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Tooltip>
                  </Grid>

                  <Grid item xs={12} sm={8}>
                    <Tooltip title="Atlassian API Token generated from id.atlassian.com / Security / API tokens" arrow placement="top">
                      <TextField
                        fullWidth
                        label="JIRA_API_TOKEN"
                        type={showToken ? "text" : "password"}
                        value={formValues.JIRA_API_TOKEN}
                        onChange={handleChange("JIRA_API_TOKEN")}
                        size="small"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton size="small" onClick={() => setShowToken(!showToken)}>
                                {showToken ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Tooltip>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Tooltip title="Jira project key prefix (e.g. DEV, PROJ, BUG)" arrow placement="top">
                      <TextField
                        fullWidth
                        label="JIRA_PROJECT_KEY"
                        placeholder="DEV"
                        value={formValues.JIRA_PROJECT_KEY}
                        onChange={handleChange("JIRA_PROJECT_KEY")}
                        size="small"
                      />
                    </Tooltip>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </form>
      )}
    </Box>
  );
}

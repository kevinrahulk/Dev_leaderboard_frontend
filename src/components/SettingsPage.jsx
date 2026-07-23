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
  Chip,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  useTheme,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ConnectionIcon from "@mui/icons-material/NetworkCheck";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import {
  getProjects,
  addProject,
  editProject,
  removeProject,
  testProject,
  setActiveProjectId,
} from "../store/slices/leaderboardSlice";

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const {
    projects,
    activeProjectId,
    projectsLoading,
    projectSaving,
    jiraTesting,
    jiraTestResult,
  } = useAppSelector((state) => state.leaderboard);

  // Modal State
  const [openModal, setOpenModal] = useState(false);
  const [editingProj, setEditingProj] = useState(null); // null means adding a new one
  const [showToken, setShowToken] = useState(false);

  const [formValues, setFormValues] = useState({
    name: "",
    jira_project_key: "",
    jira_base_url: "",
    jira_email: "",
    jira_api_token: "",
  });

  useEffect(() => {
    dispatch(getProjects());
  }, [dispatch]);

  const handleOpenAdd = () => {
    setEditingProj(null);
    setFormValues({
      name: "",
      jira_project_key: "",
      jira_base_url: "",
      jira_email: "",
      jira_api_token: "",
    });
    setOpenModal(true);
  };

  const handleOpenEdit = (proj) => {
    setEditingProj(proj);
    setFormValues({
      name: proj.name || "",
      jira_project_key: proj.jira_project_key || "",
      jira_base_url: proj.jira_base_url || "",
      jira_email: proj.jira_email || "",
      jira_api_token: proj.jira_api_token || "",
    });
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  const handleChange = (field) => (e) => {
    setFormValues({ ...formValues, [field]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingProj) {
      dispatch(editProject({ id: editingProj.id, payload: formValues }));
    } else {
      dispatch(addProject(formValues));
    }
    setOpenModal(false);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete the project "${name}"? This removes all local bug statistics.`)) {
      dispatch(removeProject(id));
    }
  };

  const handleTestConnection = (id) => {
    dispatch(testProject(id));
  };

  return (
    <Box sx={{ maxWidth: 960, mx: "auto", py: 2 }}>
      {/* Header and Configure New Button */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Manage Projects
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Configure and link multiple software project dashboards with Jira API keys.
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenAdd}
          sx={{ borderRadius: 1 }}
        >
          New Project
        </Button>
      </Stack>

      {/* Projects Grid List */}
      {projectsLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : projects.length === 0 ? (
        <Paper variant="outlined" sx={{ p: 6, textCenter: "center", borderRadius: 2, textAlign: "center" }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            No Projects Configured
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Get started by adding a software project with its Atlassian Jira API settings.
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAdd}>
            Configure Project
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {projects.map((proj) => {
            const isActive = proj.id === activeProjectId;
            const hasJira = Boolean(proj.jira_base_url && proj.jira_api_token);

            return (
              <Grid item xs={12} sm={6} key={proj.id}>
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: 2,
                    borderColor: isActive ? theme.palette.primary.main : theme.palette.divider,
                    borderWidth: isActive ? 2 : 1,
                    position: "relative",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    "&:hover": {
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <CardContent sx={{ pb: 1 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
                      <Box sx={{ maxWidth: "70%" }}>
                        <Typography variant="h6" fontWeight={700} noWrap>
                          {proj.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Key: <strong>{proj.jira_project_key || "None"}</strong>
                        </Typography>
                      </Box>
                      <Stack direction="row" spacing={1}>
                        <Chip
                          label={isActive ? "Active" : "Activate"}
                          size="small"
                          color={isActive ? "primary" : "default"}
                          onClick={() => dispatch(setActiveProjectId(proj.id))}
                          sx={{ fontWeight: 600, cursor: "pointer" }}
                        />
                        <Chip
                          label={hasJira ? "Jira Active" : "No Sync"}
                          size="small"
                          variant="outlined"
                          color={hasJira ? "success" : "default"}
                          sx={{ fontWeight: 600 }}
                        />
                      </Stack>
                    </Stack>

                    <Divider sx={{ my: 1.5 }} />

                    <Typography variant="caption" color="text.secondary" display="block" noWrap>
                      URL: {proj.jira_base_url || "No domain set"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block" noWrap sx={{ mt: 0.5 }}>
                      Email: {proj.jira_email || "No email set"}
                    </Typography>
                  </CardContent>

                  <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={jiraTesting ? <CircularProgress size={12} /> : <ConnectionIcon />}
                      onClick={() => handleTestConnection(proj.id)}
                      disabled={!hasJira || jiraTesting}
                    >
                      Test
                    </Button>
                    <Stack direction="row" spacing={1}>
                      <IconButton size="small" onClick={() => handleOpenEdit(proj)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete(proj.id, proj.name)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Project Input Form Dialog */}
      <Dialog open={openModal} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {editingProj ? `Edit Project: ${editingProj.name}` : "Configure New Project"}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent dividers>
            <Grid container spacing={2.5}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Project Display Name"
                  placeholder="e.g. Mobile App Team"
                  value={formValues.name}
                  onChange={handleChange("name")}
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <Tooltip title="Jira project key prefix (e.g. DEV, PROJ, BUG)" arrow placement="top">
                  <TextField
                    fullWidth
                    label="Jira Project Key"
                    placeholder="DEV"
                    value={formValues.jira_project_key}
                    onChange={handleChange("jira_project_key")}
                    size="small"
                  />
                </Tooltip>
              </Grid>

              <Grid item xs={12} sm={8}>
                <Tooltip title="Atlassian Jira URL (e.g. https://company.atlassian.net)" arrow placement="top">
                  <TextField
                    fullWidth
                    label="Jira Base URL"
                    placeholder="https://company.atlassian.net"
                    value={formValues.jira_base_url}
                    onChange={handleChange("jira_base_url")}
                    size="small"
                  />
                </Tooltip>
              </Grid>

              <Grid item xs={12}>
                <Tooltip title="Atlassian account email address associated with your API token" arrow placement="top">
                  <TextField
                    fullWidth
                    label="Jira Email"
                    placeholder="developer@company.com"
                    value={formValues.jira_email}
                    onChange={handleChange("jira_email")}
                    size="small"
                  />
                </Tooltip>
              </Grid>

              <Grid item xs={12}>
                <Tooltip title="Atlassian API Token generated from id.atlassian.com Security dashboard" arrow placement="top">
                  <TextField
                    fullWidth
                    label="Jira API Token"
                    type={showToken ? "text" : "password"}
                    value={formValues.jira_api_token}
                    onChange={handleChange("jira_api_token")}
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
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={projectSaving}>
              {projectSaving ? "Saving..." : "Save Project"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

import { useEffect } from "react";
import { CssBaseline, ThemeProvider, Box, Container, Snackbar, Alert } from "@mui/material";
import Header from "./components/Header";
import Banner from "./components/Banner";
import KpiCards from "./components/KpiCards";
import Leaderboard from "./components/Leaderboard";
import SettingsPage from "./components/SettingsPage";

import { useAppDispatch, useAppSelector } from "./hooks/reduxHooks";
import { getTheme } from "./theme";
import { closeSnackbar, getProjects } from "./store/slices/leaderboardSlice";

export default function App() {
  const dispatch = useAppDispatch();
  const { themeMode, activeTab, snackbar, projects } = useAppSelector((state) => state.leaderboard);

  const theme = getTheme(themeMode);

  useEffect(() => {
    dispatch(getProjects());
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default", pb: 6 }}>
        <Header />

        <Container maxWidth="lg" sx={{ mt: 3, px: { xs: 2, sm: 3 } }}>
          <Banner />

          {activeTab === 0 && (
            <>
              {projects.length > 0 && <KpiCards />}
              <Leaderboard />
            </>
          )}

          {activeTab === 1 && <SettingsPage />}
        </Container>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => dispatch(closeSnackbar())}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => dispatch(closeSnackbar())}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%", borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

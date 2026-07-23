import { createTheme } from "@mui/material/styles";

export const getTheme = (mode = "dark") =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: mode === "dark" ? "#6366F1" : "#4F46E5", // Indigo accent
        light: "#818CF8",
        dark: "#3730A3",
        contrastText: "#FFFFFF",
      },
      secondary: {
        main: "#EC4899", // Pink accent
      },
      success: {
        main: "#10B981", // Emerald
        light: "#34D399",
      },
      warning: {
        main: "#F59E0B", // Amber
      },
      info: {
        main: "#3B82F6", // Blue
      },
      background: {
        default: mode === "dark" ? "#0F172A" : "#F8FAFC", // Deep slate vs crisp gray
        paper: mode === "dark" ? "#1E293B" : "#FFFFFF",
      },
      text: {
        primary: mode === "dark" ? "#F8FAFC" : "#0F172A",
        secondary: mode === "dark" ? "#94A3B8" : "#64748B",
      },
      divider: mode === "dark" ? "rgba(148, 163, 184, 0.12)" : "rgba(100, 116, 139, 0.12)",
    },
    typography: {
      fontFamily: [
        "Inter",
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        '"Helvetica Neue"',
        "Arial",
        "sans-serif",
      ].join(","),
      h4: {
        fontWeight: 700,
        letterSpacing: "-0.02em",
      },
      h5: {
        fontWeight: 600,
        letterSpacing: "-0.01em",
      },
      h6: {
        fontWeight: 600,
      },
      subtitle1: {
        fontWeight: 500,
      },
      button: {
        textTransform: "none",
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 6,
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            boxShadow:
              mode === "dark"
                ? "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.2)"
                : "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.03)",
            transition: "all 0.2s ease-in-out",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 5,
            padding: "8px 16px",
            boxShadow: "none",
            "&:hover": {
              boxShadow: "0 4px 12px rgba(99, 102, 241, 0.25)",
            },
          },
          containedPrimary: {
            background: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 600,
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: {
            fontWeight: 600,
            backgroundColor: mode === "dark" ? "#1E293B" : "#F1F5F9",
          },
        },
      },
    },
  });

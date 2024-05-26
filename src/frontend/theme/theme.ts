import { createTheme, responsiveFontSizes, Theme } from "@mui/material";

export const theme = responsiveFontSizes(
  createTheme({
    palette: {
      primary: {
        main: "#268bd2", // Solarized Blue (Main color - now vibrant)
        light: "#839496", // Solarized Base03 (Lighter for accents/contrast)
        dark: "#073642", // Solarized Base01 (Darker for strong accents)
      },
      secondary: {
        main: "#b58900", // Solarized Yellow (Brighter accent)
        light: "#cb4b16", // Solarized Orange (Alternative accent)
        dark: "#dc322f", // Solarized Red (Another accent for depth)
      },
      background: {
        default: "#fdf6e3", // Solarized Base3
        paper: "#eee8d5", // Solarized Base2
      },
      success: {
        main: "#859900", // Solarized Green
      },
      warning: {
        main: "#b58900", // Solarized Yellow
      },
      error: {
        main: "#dc322f", // Solarized Red (Maintains error visibility)
      },
      info: {
        main: "#2aa198", // Solarized Cyan
      },
      text: {
        primary: "#586e75", // Slightly darker than Base01 for a touch more contrast
        secondary: "#002b36", // Unchanged - still good contrast
        disabled: "#93a1a1", // Unchanged - light enough for disabled
      },
    },
    typography: {
      fontFamily: ['"Source Code Pro"', "monospace"].join(","),
    },

    components: {
      MuiTable: {
        styleOverrides: {
          root: {
            backgroundColor: "#fdf6e3", // Use your default background color
            "& .MuiTableCell-root": {
              // padding: theme.spacing(1.5),
              // borderBottom: `1px solid ${theme.palette.divider}`, // Use divider color
            },
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            "&:nth-of-type(odd)": {
              backgroundColor: "#eee8d5", // Use paper background color for striping
            },
            "&:hover": {
              backgroundColor: "#eee8d5", // Use paper background color for hover
            },
          },
        },
      },
    },
  }),
);

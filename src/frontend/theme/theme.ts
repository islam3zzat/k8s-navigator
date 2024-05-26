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
        primary: "#586e75", // Solarized Base01 (Darker grey for readability)
        secondary: "#657b83", // Solarized Base00 (Lighter grey for secondary text)
      },
    },
    typography: {
      fontFamily: ['"Source Code Pro"', "monospace"].join(","),
    },
  }),
);

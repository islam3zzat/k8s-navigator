import { createTheme } from "@mui/material/styles";

// Define the Solarized Dark color palette
const solarizedDarkColors = {
  base03: "#002b36",
  base02: "#073642",
  base01: "#586e75",
  base00: "#657b83",
  base0: "#839496",
  base1: "#93a1a1",
  base2: "#eee8d5",
  base3: "#fdf6e3",
  yellow: "#b58900",
  orange: "#cb4b16",
  red: "#dc322f",
  magenta: "#d33682",
  violet: "#6c71c4",
  blue: "#268bd2",
  cyan: "#2aa198",
  green: "#859900",
};

// Define high contrast colors
const highContrastColors = {
  background: "#000000", // Black background
  paper: "#121212", // Very dark grey for paper background
  textPrimary: "#FFFFFF", // White primary text
  textSecondary: "#CCCCCC", // Light grey secondary text
  textDisabled: "#888888", // Grey disabled text
  divider: "#444444", // Dark grey divider
  hover: "#333333", // Dark grey hover
  selected: "#555555", // Slightly lighter grey selected
};

// Create the high contrast theme
export const highContrastTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: solarizedDarkColors.blue,
    },
    secondary: {
      main: solarizedDarkColors.green,
    },
    background: {
      default: highContrastColors.background,
      paper: highContrastColors.paper,
    },
    text: {
      primary: highContrastColors.textPrimary,
      secondary: highContrastColors.textSecondary,
      disabled: highContrastColors.textDisabled,
    },
    action: {
      active: highContrastColors.textPrimary,
      hover: highContrastColors.hover,
      selected: highContrastColors.selected,
      disabled: highContrastColors.textDisabled,
      disabledBackground: highContrastColors.paper,
    },
    divider: highContrastColors.divider,
  },
  typography: {
    fontFamily: ['"Source Code Pro"', "monospace", "Roboto"].join(","),
  },
  components: {
    MuiTable: {
      styleOverrides: {
        root: {
          backgroundColor: highContrastColors.paper,
          borderColor: highContrastColors.divider,
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:nth-of-type(odd)": {
            backgroundColor: highContrastColors.paper,
          },
          "&:nth-of-type(even)": {
            backgroundColor: highContrastColors.background,
          },
          "&:hover": {
            backgroundColor: highContrastColors.hover,
            color: highContrastColors.textPrimary,
          },
        },
      },
    },
  },
});

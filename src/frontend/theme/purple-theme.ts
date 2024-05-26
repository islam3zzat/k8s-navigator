import { createTheme } from "@mui/material/styles";

// Define the Purple Dark color palette
const purpleDarkColors = {
  base03: "#1e1e2e",
  base02: "#282a36",
  base01: "#44475a",
  base00: "#6272a4",
  base0: "#bfc7d5",
  base1: "#f8f8f2",
  base2: "#6272a4",
  base3: "#f8f8f2",
  yellow: "#f1fa8c",
  orange: "#ffb86c",
  red: "#ff5555",
  magenta: "#ff79c6",
  violet: "#bd93f9",
  blue: "#8be9fd",
  cyan: "#8be9fd",
  green: "#50fa7b",
};

// Create the dark theme
export const purpleDarkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: purpleDarkColors.violet,
    },
    secondary: {
      main: purpleDarkColors.blue,
    },
    background: {
      default: purpleDarkColors.base03,
      paper: purpleDarkColors.base02,
    },
    text: {
      primary: purpleDarkColors.base0,
      secondary: purpleDarkColors.base1,
      disabled: purpleDarkColors.base01,
    },
    action: {
      active: purpleDarkColors.base0,
      hover: purpleDarkColors.base01,
      selected: purpleDarkColors.base02,
      disabled: purpleDarkColors.base01,
      disabledBackground: purpleDarkColors.base02,
    },
    divider: purpleDarkColors.base01,
  },
  typography: {
    fontFamily: ['"Source Code Pro"', "monospace", "Roboto"].join(","),
  },
  components: {
    MuiTable: {
      styleOverrides: {
        root: {
          backgroundColor: purpleDarkColors.base03,
          borderColor: purpleDarkColors.base01,
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:nth-of-type(odd)": {
            backgroundColor: purpleDarkColors.base02,
          },
          "&:nth-of-type(even)": {
            backgroundColor: purpleDarkColors.base03,
          },
          "&:hover": {
            backgroundColor: purpleDarkColors.base01,
            color: purpleDarkColors.base3, // Lighter text color on hover
          },
        },
      },
    },
  },
});

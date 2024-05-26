import { createTheme } from "@mui/material/styles";
import { ThemeOptions } from "@mui/material/styles/createTheme";

// Define the Solarized color palette
const solarizedColors = {
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

// Create the theme
export const theme = createTheme({
  palette: {
    primary: {
      main: solarizedColors.blue,
    },
    secondary: {
      main: solarizedColors.green,
    },
    background: {
      default: solarizedColors.base3,
      paper: solarizedColors.base2,
    },
    text: {
      primary: solarizedColors.base00,
      secondary: solarizedColors.base01,
      disabled: solarizedColors.base1,
    },
    action: {
      active: solarizedColors.base01,
      hover: solarizedColors.base02,
      selected: solarizedColors.base02,
      disabled: solarizedColors.base1,
      disabledBackground: solarizedColors.base2,
    },
    divider: solarizedColors.base1,
  },
  typography: {
    fontFamily: ['"Source Code Pro"', "monospace", "Roboto"].join(","),
  },
  components: {
    MuiTable: {
      styleOverrides: {
        root: {
          backgroundColor: solarizedColors.base3,
          borderColor: solarizedColors.base1,
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:nth-of-type(odd)": {
            backgroundColor: solarizedColors.base2,
          },
          "&:nth-of-type(even)": {
            backgroundColor: solarizedColors.base3,
          },
          "&:hover": {
            backgroundColor: solarizedColors.base1,
            color: solarizedColors.base3,
          },
        },
      },
    },
  },
});

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

// Create the dark theme
export const solarizedDarkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: solarizedDarkColors.blue,
    },
    secondary: {
      main: solarizedDarkColors.green,
    },
    background: {
      default: solarizedDarkColors.base03,
      paper: solarizedDarkColors.base02,
    },
    text: {
      primary: solarizedDarkColors.base0,
      secondary: solarizedDarkColors.base1,
      disabled: solarizedDarkColors.base01,
    },
    action: {
      active: solarizedDarkColors.base0,
      hover: solarizedDarkColors.base2,
      selected: solarizedDarkColors.base02,
      disabled: solarizedDarkColors.base01,
      disabledBackground: solarizedDarkColors.base02,
    },
    divider: solarizedDarkColors.base01,
  },
  typography: {
    fontFamily: ['"Source Code Pro"', "monospace", "Roboto"].join(","),
  },
  components: {
    MuiTable: {
      styleOverrides: {
        root: {
          backgroundColor: solarizedDarkColors.base03,
          borderColor: solarizedDarkColors.base01,
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:nth-of-type(odd)": {
            backgroundColor: solarizedDarkColors.base02,
          },
          "&:nth-of-type(even)": {
            backgroundColor: solarizedDarkColors.base03,
          },
          "&:hover": {
            backgroundColor: solarizedDarkColors.base01,
            color: solarizedDarkColors.base3, // Lighter text color on hover
          },
        },
      },
    },
  },
});

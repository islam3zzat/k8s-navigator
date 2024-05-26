import "@mui/material";

declare module "@mui/material/styles" {
  interface Theme {
    spacing: (value: number) => number;
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    spacing?: (value: number) => number;
  }
}

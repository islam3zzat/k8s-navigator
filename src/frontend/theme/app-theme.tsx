import ThemeProvider from "@mui/material/styles/ThemeProvider";
import { ReactNode } from "react";
import { solarizedDarkTheme } from "./dark-theme";
import { lightTheme } from "./light-theme";
import { purpleDarkTheme } from "./purple-theme";
import { highContrastTheme } from "./high-contrast";
import { useAppContext } from "../app-context";

function getTheme(theme: string) {
  switch (theme) {
    case "dark":
      return solarizedDarkTheme;
    case "purple-night":
      return purpleDarkTheme;
    case "high-contrast":
      return highContrastTheme;
    default:
      return lightTheme;
  }
}
export const AppTheme = ({ children }: { children: ReactNode }) => {
  const { state } = useAppContext();

  return (
    <ThemeProvider theme={getTheme(state.theme)}>{children}</ThemeProvider>
  );
};

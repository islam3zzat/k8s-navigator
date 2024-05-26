import { ThemeProvider } from "@mui/material";
import { solarizedDarkTheme } from "./dark-theme";
import { ReactNode } from "react";
import { useAppContext } from "../app-context";
import { lightTheme } from "./light-theme";
import { purpleDarkTheme } from "./purple-theme";

function getTheme(theme: string) {
  switch (theme) {
    case "dark":
      return solarizedDarkTheme;
    case "purple-night":
      return purpleDarkTheme;
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

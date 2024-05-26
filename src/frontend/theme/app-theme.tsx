import { ThemeProvider } from "@mui/material";
import { solarizedDarkTheme } from "./dark-theme";
import { ReactNode } from "react";
import { useAppContext } from "../app-context";
import { lightTheme } from "./light-theme";

export const AppTheme = ({ children }: { children: ReactNode }) => {
  const { state } = useAppContext();
  const theme = state.theme === "dark" ? solarizedDarkTheme : lightTheme;
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

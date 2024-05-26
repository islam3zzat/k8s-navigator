import { Helmet } from "react-helmet-async";
import React, { useEffect } from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useAppContext, State } from "../../app-context";

export const SettingsPage = () => {
  const { state, dispatch } = useAppContext();

  const handleThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedTheme = event.target.value as State["theme"];
    dispatch({
      type: "SET_THEME",
      theme: selectedTheme,
    });
    localStorage.setItem("theme", selectedTheme);
  };
  return (
    <>
      <Helmet>
        <title>Settings</title>
      </Helmet>
      <Box p={2}>
        <Typography variant="h5" gutterBottom>
          Settings
        </Typography>

        <FormControl variant="outlined" margin="normal">
          <InputLabel htmlFor="theme-select">Theme</InputLabel>
          <Select
            id="theme-select"
            value={state.theme}
            onChange={handleThemeChange}
            label="Theme"
          >
            <MenuItem value="light">Light</MenuItem>
            <MenuItem value="dark">Dark</MenuItem>
            <MenuItem value="purple-night">Purple Night</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </>
  );
};

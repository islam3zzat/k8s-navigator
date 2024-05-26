import { Helmet } from "react-helmet-async";
import React from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useAppContext } from "../../app-context";

export const SettingsPage = () => {
  const { state, dispatch } = useAppContext();

  const handleThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "SET_THEME",
      theme: event.target.value as "light" | "dark",
    });
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

        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel htmlFor="theme-select">Theme</InputLabel>
          <Select
            id="theme-select"
            value={state.theme}
            onChange={handleThemeChange}
            label="Theme"
          >
            <MenuItem value="light">Light</MenuItem>
            <MenuItem value="dark">Dark</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </>
  );
};

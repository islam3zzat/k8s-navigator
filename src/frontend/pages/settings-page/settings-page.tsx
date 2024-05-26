import { Helmet } from "react-helmet-async";
import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { State, useAppContext } from "../../app-context";

const SettingsPage = () => {
  const { state, dispatch } = useAppContext();

  const handleThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedTheme = event.target.value as State["theme"];
    dispatch({
      type: "SET_THEME",
      theme: selectedTheme,
    });
    localStorage.setItem("theme", selectedTheme);
  };

  const [watchInterval, setWatchInterval] = React.useState<number>(
    state.watchIntervalsSeconds,
  );
  const handleIntervalChange = () => {
    dispatch({
      type: "SET_WATCH_INTERVAL",
      watchIntervalsSeconds: watchInterval,
    });
    localStorage.setItem("watchIntervalSeconds", watchInterval.toString());
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

        <Grid container spacing={2}>
          {" "}
          {/* Grid container for layout */}
          <Grid item xs={12} sm={6}>
            <FormControl variant="outlined" margin="normal" fullWidth>
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
                <MenuItem value="high-contrast">High Contrast</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl variant="outlined" margin="normal" fullWidth>
              <TextField
                id="interval-select"
                value={watchInterval}
                onChange={(e) => setWatchInterval(parseFloat(e.target.value))}
                onBlur={handleIntervalChange}
                type="number"
                inputProps={{ step: 0.5 }}
                label="Watch Interval (seconds)"
                variant="outlined"
              />
            </FormControl>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default SettingsPage;

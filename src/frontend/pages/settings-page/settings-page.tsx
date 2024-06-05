import * as React from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Link as RouterLink } from "react-router-dom";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import SettingsEthernetIcon from "@mui/icons-material/SettingsEthernet";
import { Helmet } from "react-helmet-async";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import { PortForward, State, useAppContext } from "../../app-context";

const SettingsPage = () => {
  const { state, dispatch } = useAppContext();

  const handleReadOnlyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const readOnly = event.target.checked;
    dispatch({ type: "SET_READ_ONLY", isReadOnly: readOnly });
  };

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

  const handleClosePortForward = React.useCallback(
    (portForward: PortForward) => {
      window.k8sNavigator
        .closePortForward(
          state.activeNamespace,
          portForward.name,
          portForward.targetPort,
          portForward.userPort,
        )
        .then(() => {
          dispatch({ type: "REMOVE_PORT_FORWARD", portForward });
        });
    },

    [state.activeNamespace, dispatch],
  );

  const handleCloseAllPortForwards = React.useCallback(() => {
    window.k8sNavigator.closeAllPortForwards().then(() => {
      dispatch({ type: "REMOVE_ALL_PORT_FORWARDS" });
    });
  }, [dispatch]);

  return (
    <>
      <Helmet>
        <title>Settings</title>
      </Helmet>
      <Box p={2} minWidth={400}>
        <Stack spacing={4}>
          <Typography variant="h5" gutterBottom>
            Settings
          </Typography>

          <Stack spacing={2}>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox defaultChecked />}
                checked={state.isReadOnly}
                onChange={handleReadOnlyChange}
                label="Read Only Mode"
              />
            </FormGroup>
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

            <FormControl variant="outlined" margin="normal" fullWidth>
              <TextField
                id="interval-select"
                value={watchInterval}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setWatchInterval(parseFloat(e.target.value))
                }
                onBlur={handleIntervalChange}
                type="number"
                inputProps={{ step: 0.5 }}
                label="Watch Interval (seconds)"
                variant="outlined"
              />
            </FormControl>
          </Stack>

          {state.portForwards.length > 0 && (
            <Stack spacing={2}>
              <Typography variant="h6">Running Port Forwards</Typography>
              {state.portForwards.map((pf) => (
                <Stack key={pf.name + pf.userPort} spacing={1}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <SettingsEthernetIcon fontSize="small" />
                    <Link
                      component={RouterLink}
                      flex={1}
                      to={`/pods/${pf.name}`}
                      color="inherit"
                      underline="hover"
                    >
                      <Typography variant="body1">{pf.name}</Typography>
                    </Link>
                  </Stack>
                  <Button
                    variant="outlined"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleClosePortForward(pf)}
                  >
                    {`${pf.targetPort} ~> ${pf.userPort}`}
                  </Button>
                </Stack>
              ))}
              <Button variant="outlined" onClick={handleCloseAllPortForwards}>
                Stop all
              </Button>
            </Stack>
          )}
        </Stack>
      </Box>
    </>
  );
};

export default SettingsPage;

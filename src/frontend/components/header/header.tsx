import { motion, useAnimationControls } from "framer-motion";
import ExploreIcon from "@mui/icons-material/Explore";
import Stack from "@mui/material/Stack";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Link as RouterLink } from "react-router-dom";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import Badge from "@mui/material/Badge";
import DeleteIcon from "@mui/icons-material/Delete";
import SettingsEthernetIcon from "@mui/icons-material/SettingsEthernet";
import RouterIcon from "@mui/icons-material/Router";
import {
  ConfirmationDialog,
  ContextSelect,
  NamespaceSelect,
} from "../../components";
import { PortForward, useAppContext } from "../../app-context";

export const Header: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const activePortForwards = state.portForwards.length;
  React.useEffect(() => {
    async function fetchData() {
      const portForwards = await window.k8sNavigator.listForwardedPortServers();

      dispatch({ type: "SET_PORT_FORWARDS", portForwards });
    }

    fetchData();
  }, [dispatch]);
  const iconAnimation = useAnimationControls();

  const handleMouseEnter = async () => {
    iconAnimation.start({ rotate: 360, transition: { duration: 1 } });
  };

  const handleMouseLeave = async () => {
    iconAnimation.start({ rotate: 0, transition: { duration: 1 } });
  };
  const [open, setOpen] = React.useState(false);
  const handleOpen = React.useCallback(() => setOpen(true), []);
  const handleClose = React.useCallback(() => setOpen(false), []);
  const handleClosePortForward = React.useCallback(
    (portForward: PortForward) => {
      window.k8sNavigator.closePortForward(
        state.activeNamespace,
        portForward.name,
        portForward.targetPort,
        portForward.userPort,
      );
      dispatch({ type: "REMOVE_PORT_FORWARD", portForward });
    },

    [state.activeNamespace, dispatch],
  );

  const handleCloseAllPortForwards = React.useCallback(() => {
    window.k8sNavigator.closeAllPortForwards();
    dispatch({ type: "REMOVE_ALL_PORT_FORWARDS" });
  }, [dispatch]);

  React.useEffect(() => {
    // Close modal when all port forwards are stopped
    if (open && activePortForwards === 0) {
      handleClose();
    }
  }, [open, activePortForwards, handleClose]);

  return (
    <>
      <AppBar position="fixed">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Link
            component={RouterLink}
            flex={1}
            to="/"
            color="inherit"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <motion.div animate={iconAnimation}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <ExploreIcon sx={{ fontSize: 24 }} />
                </div>
              </motion.div>
              <Typography variant="h6" component="div">
                K8S Navigator
              </Typography>
            </Stack>
          </Link>
          {!!activePortForwards && (
            <Badge badgeContent={activePortForwards} color="info">
              <RouterIcon
                sx={{ cursor: "pointer" }}
                titleAccess={`${activePortForwards} running port forwards`}
                onClick={handleOpen}
              />
            </Badge>
          )}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <NamespaceSelect />
            <ContextSelect />
          </Box>
        </Toolbar>
      </AppBar>

      <ConfirmationDialog
        isOpen={open}
        onClose={handleClose}
        primaryButtonText="Stop all"
        onConfirm={handleCloseAllPortForwards}
        title="Running Port Forwards"
      >
        <Stack spacing={2}>
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
        </Stack>
      </ConfirmationDialog>
    </>
  );
};

import { motion, useAnimationControls } from "framer-motion";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import ExploreIcon from "@mui/icons-material/Explore";
import SettingsIcon from "@mui/icons-material/Settings";
import Stack from "@mui/material/Stack";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Link as RouterLink } from "react-router-dom";
import Link from "@mui/material/Link";
import Badge from "@mui/material/Badge";
import Drawer from "@mui/material/Drawer";
import { useAppContext } from "../../app-context";
import { ContextSelect, NamespaceSelect } from "../../components";

const SettingsPage = React.lazy(
  () =>
    import(
      /* webpackChunkName: "settings" */
      "../../pages/settings-page"
    ),
);

const AuthenticationPage = React.lazy(
  () =>
    import(
      /* webpackChunkName: "authentication" */
      "../../pages/authentication-page"
    ),
);

const IconButtonWithRef = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ ...props }, ref) => {
    return <IconButton sx={{ color: "inherit" }} {...props} ref={ref} />;
  },
);
IconButtonWithRef.displayName = "IconButtonWithRef";

const MotionIconButton = motion(IconButtonWithRef);
MotionIconButton.displayName = "MotionIconButton";

const settingsIconVarinats = {
  hover: { rotate: 10, transition: { duration: 0.3 } },
  focus: { rotate: 10, transition: { duration: 0.3 } },
  tap: { rotate: 0 }, // You might not need this if the animation automatically resets on mouse leave
};

export const Header: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [isSettingsVisible, setIsSettingsVisible] = React.useState(false);
  const [isAuthDrawerVisible, setAuthDrawerVisible] = React.useState(false);

  const toggleSettings = React.useCallback(
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setIsSettingsVisible(open);
    },
    [],
  );
  const toggleAuthDrawer = React.useCallback(
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setAuthDrawerVisible(open);
    },
    [],
  );

  const activePortForwards = state.portForwards.length;
  React.useEffect(() => {
    async function fetchData() {
      const portForwards = await window.k8sNavigator.listForwardedPortServers();

      dispatch({ type: "SET_PORT_FORWARDS", portForwards });
    }

    fetchData();
  }, [dispatch]);
  const iconAnimation = useAnimationControls();
  const [isMouseOver, setIsMouseOver] = React.useState(false);

  const handleMouseEnter = React.useCallback(() => {
    iconAnimation.start({ rotate: 15, transition: { duration: 0.3 } });
  }, [iconAnimation]);

  const handleMouseLeave = React.useCallback(() => {
    iconAnimation.start({ rotate: 0, transition: { duration: 0.3 } });
  }, [iconAnimation]);

  React.useEffect(() => {
    if (isMouseOver) {
      handleMouseEnter();
    } else {
      handleMouseLeave();
    }
  }, [isMouseOver, handleMouseEnter, handleMouseLeave]);

  return (
    <>
      <AppBar position="fixed">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Link
            component={RouterLink}
            to="/"
            color="inherit"
            onMouseEnter={() => setIsMouseOver(true)}
            onMouseLeave={() => setIsMouseOver(false)}
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

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <NamespaceSelect />
            <ContextSelect />
            <MotionIconButton
              whileHover="hover"
              whileFocus="focus"
              whileTap="tap"
              variants={settingsIconVarinats}
              role="link"
              onClick={() => setIsSettingsVisible(true)}
              color="default"
              aria-label="Settings"
            >
              <Badge badgeContent={activePortForwards} color="info">
                <SettingsIcon sx={{ fontSize: 24 }} />
              </Badge>
            </MotionIconButton>
            <IconButton
              role="link"
              onClick={() => setAuthDrawerVisible(true)}
              color="default"
              aria-label="Authentications"
              sx={{ color: "inherit" }}
            >
              <AccountCircleIcon sx={{ fontSize: 24 }} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <React.Suspense fallback={null}>
        <Drawer
          anchor={"right"}
          open={isSettingsVisible}
          onClose={toggleSettings(false)}
        >
          <SettingsPage />
        </Drawer>
      </React.Suspense>
      <React.Suspense fallback={null}>
        <Drawer
          anchor={"right"}
          open={isAuthDrawerVisible}
          onClose={toggleAuthDrawer(false)}
        >
          <AuthenticationPage />
        </Drawer>
      </React.Suspense>
    </>
  );
};

import React, { memo, Suspense, useEffect } from "react";
import { Outlet, Link as RouterLink } from "react-router-dom";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import HomeIcon from "@mui/icons-material/Home";
import ErrorBoundary from "../../components/error-boundry/error-boundry";
import { FindInPage, Header, ResourceIcon } from "../../components";
import { useAppContext } from "../../app-context";
import LoadingFallback from "../../components/loading-fallback";

const getBradCrumbIcon = (name: string, isPrimary: boolean) => {
  switch (name) {
    case "Home":
      return <HomeIcon sx={{ width: "1rem" }} />;
    case "Deployment":
      return <ResourceIcon resourceName="Deployment" isPrimary={isPrimary} />;
    case "Pod":
      return <ResourceIcon resourceName="Pod" isPrimary={isPrimary} />;
    case "Service":
      return <ResourceIcon resourceName="Service" isPrimary={isPrimary} />;
    case "Job":
      return <ResourceIcon resourceName="Job" isPrimary={isPrimary} />;
    case "CronJobs":
      return <ResourceIcon resourceName="CronJob" isPrimary={isPrimary} />;
    case "ServiceAccount":
      return (
        <ResourceIcon resourceName="ServiceAccount" isPrimary={isPrimary} />
      );
    case "Secret":
      return <ResourceIcon resourceName="Secret" isPrimary={isPrimary} />;
    case "ConfigMap":
      return <ResourceIcon resourceName="ConfigMap" isPrimary={isPrimary} />;
    case "ReplicaSet":
      return <ResourceIcon resourceName="ReplicaSet" isPrimary={isPrimary} />;
    default:
      return null;
  }
};

type BreadCrumbIconProps = { iconName: string; isPrimary?: boolean };

const BreadCrumbIcon = memo(
  ({ iconName, isPrimary }: BreadCrumbIconProps) => {
    const icon = getBradCrumbIcon(iconName, isPrimary);
    if (!icon) {
      return null;
    }

    return icon;
  },
  (prevProps, nextProps) =>
    prevProps.iconName === nextProps.iconName &&
    prevProps.isPrimary === nextProps.isPrimary,
);
BreadCrumbIcon.displayName = "BreadCrumbIcon";

const App: React.FC = () => {
  const { state, dispatch } = useAppContext();
  // listen for command-f, or control-f keyboad shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "f" && (e.metaKey || e.ctrlKey)) {
        dispatch({ type: "SHOW_FIND_IN_PAGE" });
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [dispatch]);

  useEffect(() => {
    async function fetchData() {
      const context = await window.k8sNavigator.getCurrentContext();
      dispatch({ type: "SET_ACTIVE_CONTEXT", context });
    }

    fetchData();
  }, [dispatch]);

  const lastBreadcrumb = state.breadCrumbs[state.breadCrumbs.length - 1];
  const otherBreadcrumbs = state.breadCrumbs.slice(
    0,
    state.breadCrumbs.length - 1,
  );

  return (
    <Stack spacing={2} alignItems="center">
      <Header />
      <main style={{ width: "100%" }}>
        <Container maxWidth="lg" sx={{ marginBlock: 8 }}>
          <Stack justifyContent="center">
            <Breadcrumbs sx={{ marginBlock: 2 }} aria-label="breadcrumb">
              {otherBreadcrumbs.map((crumb, index) => (
                <Link
                  key={crumb.label}
                  component={RouterLink}
                  underline="hover"
                  sx={{ display: "flex", alignItems: "center" }}
                  color="inherit"
                  to={crumb.path}
                  style={{ display: "flex", alignItems: "center" }}
                  onClick={() => {
                    dispatch({
                      type: "SLICE_BREADCRUMB",
                      index: index + 1,
                    });
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <BreadCrumbIcon
                      aria-label={`Navigate to ${crumb.label}`}
                      iconName={crumb.iconName}
                    />
                    <Typography>{crumb.label}</Typography>
                  </Stack>
                </Link>
              ))}
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <BreadCrumbIcon
                  aria-label={`Breadcrumb navigation - ${lastBreadcrumb.label}`}
                  isPrimary
                  iconName={lastBreadcrumb.iconName}
                />
                <Typography>{lastBreadcrumb.label}</Typography>
              </Stack>
            </Breadcrumbs>
            <main>
              <Suspense fallback={<LoadingFallback />}>
                <ErrorBoundary>
                  <Outlet />
                </ErrorBoundary>
              </Suspense>
            </main>
          </Stack>
        </Container>
      </main>
      <FindInPage />
    </Stack>
  );
};

export default App;

import styled from "@mui/material/styles/styled";
import type { Theme } from "@mui/material/styles";
import { Helmet } from "react-helmet-async";
import { forwardRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Paper, { PaperProps } from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { motion } from "framer-motion";
import { ResourceIcon } from "../../components";
import { useAppContext } from "../../app-context";
import { ResourceName } from "../../components/resource-icon/icon-loader";

const iconVariants = {
  hover: { scale: 1.02, transition: { duration: 0.3 } },
  tap: { scale: 0.98 },
};
const Item = styled(Paper)(({ theme }: { theme: Theme }) => ({
  ...theme.typography.body2,
  textAlign: "center",
  color: theme.palette.text.secondary,
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.04)",
  },
  display: "flex",
  alignItems: "center",
  paddingBlock: 10,
  paddingInline: 20,
  marginInlineEnd: 20,
  padding: theme.spacing(1),
  width: "auto",
  minWidth: 200,
  margin: theme.spacing(1),
}));
const ItemWithRef = forwardRef<HTMLDivElement, PaperProps>(
  ({ ...props }, ref) => {
    return <Item {...props} ref={ref} />;
  },
);
ItemWithRef.displayName = "ItemWithRef";

const MotionItem = motion(ItemWithRef);
MotionItem.displayName = "MotionItem";

type HomepageItem = {
  path: string;
  resourceName: ResourceName;
  label: string;
};

const homepageItems: HomepageItem[] = [
  {
    path: "/deployments",
    resourceName: "Deployment",
    label: "Deployments",
  },
  {
    path: "/replica-sets",
    resourceName: "ReplicaSet",
    label: "ReplicaSets",
  },
  { path: "/pods", resourceName: "Pod", label: "Pods" },
  { path: "/services", resourceName: "Service", label: "Services" },
  { path: "/jobs", resourceName: "Job", label: "Jobs" },
  { path: "/cron-jobs", resourceName: "CronJob", label: "Cron Jobs" },
  {
    path: "/service-accounts",
    resourceName: "ServiceAccount",
    label: "Service Accounts",
  },
  { path: "/secrets", resourceName: "Secret", label: "Secrets" },
  {
    path: "/config-maps",
    resourceName: "ConfigMap",
    label: "Config Maps",
  },
];

const HomePage = () => {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch({
      type: "RESET_BREADCRUMBS",
    });
  }, [dispatch]);

  // Function to handle click and Enter key press for navigation
  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <>
      <Helmet>
        <title>K8S Navigator - Home</title>
      </Helmet>
      <Stack spacing={2}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="h6">Context:</Typography>
          <Typography variant="body1">{state.activeContext?.name}</Typography>
        </Stack>
        <Stack direction="row" flexWrap="wrap" gap={1}>
          {homepageItems.map(({ path, resourceName, label }) => (
            <MotionItem
              variants={iconVariants}
              whileHover="hover"
              whileTap="tap"
              key={path}
              role="link"
              aria-label={`Navigate to ${label}`}
              tabIndex={0}
              onClick={() => handleNavigation(path)}
              onKeyDown={(e: React.KeyboardEvent) =>
                e.key === "Enter" && handleNavigation(path)
              }
            >
              <Stack
                justifyContent={"flex-start"}
                alignItems={"center"}
                direction="row"
                spacing={1}
              >
                <ResourceIcon size={3} resourceName={resourceName} isPrimary />
                <Typography variant="button">{label}</Typography>
              </Stack>
            </MotionItem>
          ))}
        </Stack>
      </Stack>
    </>
  );
};
export default HomePage;

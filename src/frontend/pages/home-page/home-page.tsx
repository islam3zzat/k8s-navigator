import { styled, Theme } from "@mui/material/styles";
import { Helmet } from "react-helmet-async";
import { forwardRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Paper, { PaperProps } from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { motion } from "framer-motion";
import { ResourceIcon } from "../../components";
import { useAppContext } from "../../app-context";
import Deployment from "../../icons/resources/unlabeled/deploy.svg";
import Pod from "../../icons/resources/unlabeled/pod.svg";
import Service from "../../icons/resources/unlabeled/svc.svg";
import Job from "../../icons/resources/unlabeled/job.svg";
import CronJob from "../../icons/resources/unlabeled/cronjob.svg";
import ServiceAccount from "../../icons/resources/unlabeled/sa.svg";
import Secret from "../../icons/resources/unlabeled/secret.svg";
import ConfigMap from "../../icons/resources/unlabeled/cm.svg";
import ReplicaSet from "../../icons/resources/unlabeled/rs.svg";

const iconVariants = {
  hover: { scale: 1.02, transition: { duration: 0.3 } }, // Adjust the scale factor and duration as needed
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
          <Typography variant="h6">Cluster:</Typography>
          <Typography variant="body1">{state.activeContext?.name}</Typography>
        </Stack>
        <Stack direction="row" flexWrap="wrap" gap={1}>
          {[
            { path: "/deployments", icon: Deployment, label: "Deployments" },
            { path: "/replica-sets", icon: ReplicaSet, label: "ReplicaSets" },
            { path: "/pods", icon: Pod, label: "Pods" },
            { path: "/services", icon: Service, label: "Services" },
            { path: "/jobs", icon: Job, label: "Jobs" },
            { path: "/cron-jobs", icon: CronJob, label: "Cron Jobs" },
            {
              path: "/service-accounts",
              icon: ServiceAccount,
              label: "Service Accounts",
            },
            { path: "/secrets", icon: Secret, label: "Secrets" },
            { path: "/config-maps", icon: ConfigMap, label: "Config Maps" },
          ].map(({ path, icon, label }) => (
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
                <ResourceIcon size={3} icon={icon} isPrimary />
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

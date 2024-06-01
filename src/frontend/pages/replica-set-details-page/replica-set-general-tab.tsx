import { Link as RouterLink } from "react-router-dom";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { V1ReplicaSet } from "@kubernetes/client-node";
import SettingsIcon from "@mui/icons-material/Settings";
import FilterNoneIcon from "@mui/icons-material/FilterNone";
import FlagIcon from "@mui/icons-material/Flag";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import Deployment from "../../icons/resources/unlabeled/deploy.svg";
import { useAppContext } from "../../app-context";
import ServiceAccount from "../../icons/resources/unlabeled/sa.svg";
import { PodsList, ResourceIcon } from "../../components";

const ReplicaSetGeneralTab = ({
  resource: replicaSet,
}: {
  resource: V1ReplicaSet;
}) => {
  const { state } = useAppContext();

  const namespace = state.activeNamespace;

  const owners = replicaSet?.metadata?.ownerReferences || [];

  return (
    <Stack spacing={4}>
      <Stack spacing={2}>
        {replicaSet?.spec.template.spec.serviceAccountName && (
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography fontSize="small">
              <ResourceIcon size={3} resourceName="ServiceAccount" />
            </Typography>
            <Typography variant="h6">Service Account</Typography>
            <Link
              component={RouterLink}
              flex={1}
              to={`/service-accounts/${replicaSet.spec?.template.spec.serviceAccountName}`}
              sx={{}}
            >
              <Typography variant="body1">
                {replicaSet.spec?.template.spec.serviceAccountName}
              </Typography>
            </Link>
          </Stack>
        )}
        {owners
          .filter(({ kind }) => kind === "Deployment")
          .map(({ name, uid }) => (
            <Stack
              key={uid}
              direction="row"
              spacing={2}
              alignItems="center"
              justifyContent="center"
            >
              <Typography fontSize="small">
                <ResourceIcon size={3} resourceName="Deployment" />
              </Typography>
              <Link
                component={RouterLink}
                flex={1}
                to={`/deployments/${name}`}
                sx={{}}
              >
                <Typography variant="body1">{name} (deployment)</Typography>
              </Link>
            </Stack>
          ))}

        <Stack direction="row" spacing={2} alignItems="center">
          <FilterNoneIcon aria-label="Replicas" fontSize="small" />
          <Typography variant="h6">Replicas</Typography>
        </Stack>
        <Stack direction="row" spacing={2}>
          <Stack direction="row" spacing={1} alignItems="center">
            <FlagIcon aria-label="Desired replicas" fontSize="small" />
            <Typography variant="body1">
              {replicaSet?.spec?.replicas || 0} desired
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <CheckCircleIcon
              aria-label="Available replicas"
              color="success"
              fontSize="small"
            />
            <Typography color="darkgreen" variant="body1">
              {replicaSet?.status?.availableReplicas || 0} available
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <AutorenewIcon aria-label="Ready replicas" fontSize="small" />
            <Typography variant="body1">
              {replicaSet?.status?.readyReplicas || 0} ready
            </Typography>
          </Stack>
        </Stack>
      </Stack>
      <Stack spacing={2}>
        <Stack direction="row" spacing={2} alignItems="center">
          <SettingsIcon aria-label="ReplicaSet strategy" fontSize="small" />
          <Typography variant="h6">Strategy</Typography>
        </Stack>
      </Stack>
      <PodsList
        title="Pods"
        namespace={namespace}
        selector={replicaSet?.spec.selector.matchLabels}
      />
    </Stack>
  );
};
export default ReplicaSetGeneralTab;

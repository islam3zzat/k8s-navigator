import { Link as RouterLink, useParams } from "react-router-dom";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import SettingsIcon from "@mui/icons-material/Settings";
import FilterNoneIcon from "@mui/icons-material/FilterNone";
import FlagIcon from "@mui/icons-material/Flag";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import RestoreIcon from "@mui/icons-material/Restore";
import { useCallback, useState } from "react";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import type { OverridableComponent } from "@mui/material/OverridableComponent";
import { Button, SvgIconTypeMap, TextField } from "@mui/material";
import { V1Deployment } from "@kubernetes/client-node";
import { PodsList, ResourceIcon } from "../../components";
import ConfirmationDialog from "../../components/confirmation-dialog";
import { useAppContext } from "../../app-context";

const StrategyIconMapping: Record<
  string,
  OverridableComponent<SvgIconTypeMap<unknown, "svg">>
> = {
  RollingUpdate: AutorenewIcon,
  Recreate: RestoreIcon,
};
function DeploymentStrategyIcon({ strategy }: { strategy: string }) {
  const StrategyIcon = StrategyIconMapping[strategy];

  if (!StrategyIcon) {
    return null;
  }

  return <StrategyIcon />;
}
const DeploymentGeneralTab = ({
  resource: deployment,
  refetch,
}: {
  resource: V1Deployment;
  refetch: () => void;
}) => {
  const { deploymentName } = useParams<{ deploymentName: string }>();
  const { state } = useAppContext();

  const namespace = state.activeNamespace;
  const [rescalDialogOpen, setRescaleDialogOpen] = useState(false);
  const currentReplicas = deployment?.spec?.replicas || 0;
  const [scale, setScale] = useState<number | null>(null);

  const handleRescale = useCallback(() => {
    if (scale === null) {
      return;
    }

    window.k8sNavigator
      .rescaleDeployment(namespace, deploymentName, scale)
      .then(() => {
        setRescaleDialogOpen(false);
        refetch();
      })
      .catch((error) => {
        console.error(error);
      });
  }, [deploymentName, namespace, refetch, scale]);

  return (
    <>
      <Stack spacing={4}>
        <Stack spacing={2}>
          {deployment && deployment.spec?.template.spec.serviceAccountName && (
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography fontSize="small">
                <ResourceIcon size={3} resourceName="ServiceAccount" />
              </Typography>
              <Typography variant="h6">Service Account</Typography>
              <Link
                component={RouterLink}
                flex={1}
                to={`/service-accounts/${deployment.spec?.template.spec.serviceAccountName}`}
                sx={{}}
              >
                <Typography variant="body1">
                  {deployment.spec?.template.spec.serviceAccountName}
                </Typography>
              </Link>
            </Stack>
          )}
          <Stack direction="row" spacing={2} alignItems="center">
            <FilterNoneIcon fontSize="small" />
            <Typography variant="h6">Replicas</Typography>
          </Stack>
          <Stack direction="row" spacing={2}>
            <Stack direction="row" spacing={1} alignItems="center">
              <FlagIcon fontSize="small" />
              <Typography variant="body1">
                {deployment?.spec?.replicas || 0} desired
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <CheckCircleIcon color="success" fontSize="small" />
              <Typography color="darkgreen" variant="body1">
                {deployment?.status?.availableReplicas || 0} available
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <WarningIcon
                color={
                  deployment?.status?.unavailableReplicas ? "error" : undefined
                }
                fontSize="small"
              />
              <Typography
                color={
                  deployment?.status?.unavailableReplicas ? "error" : undefined
                }
                variant="body1"
              >
                {deployment?.status?.unavailableReplicas || 0} unavailable
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <AutorenewIcon fontSize="small" />
              <Typography variant="body1">
                {deployment?.status?.updatedReplicas || 0} updated
              </Typography>
            </Stack>
            <Button
              variant="contained"
              onClick={() => setRescaleDialogOpen(true)}
            >
              Rescale
            </Button>
          </Stack>
        </Stack>
        <Stack spacing={2}>
          <Stack direction="row" spacing={2} alignItems="center">
            <SettingsIcon fontSize="small" />
            <Typography variant="h6">Strategy</Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <DeploymentStrategyIcon
              strategy={deployment?.spec?.strategy?.type}
            />
            <Typography variant="body1">
              {deployment?.spec?.strategy?.type}
            </Typography>
          </Stack>
        </Stack>
        <PodsList
          title="Deployment Pods"
          namespace={namespace}
          deploymentName={deploymentName}
        />
      </Stack>
      <ConfirmationDialog
        title="Rescale Deployment"
        isOpen={rescalDialogOpen}
        onClose={() => setRescaleDialogOpen(false)}
        onConfirm={handleRescale}
        primaryButtonColor="primary"
        primaryButtonText="Rescale"
      >
        <Stack spacing={2}>
          <Typography>
            Current replicas: {currentReplicas}. Enter new number of replicas:
          </Typography>
          <TextField
            type="number"
            value={scale || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setScale(parseInt(e.target.value, 10))
            }
          />
        </Stack>
      </ConfirmationDialog>
    </>
  );
};
export default DeploymentGeneralTab;

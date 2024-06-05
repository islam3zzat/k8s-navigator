import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { BarLoader } from "react-spinners";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { V1Pod } from "@kubernetes/client-node";
import React, { useCallback, useState } from "react";
import InfoIcon from "@mui/icons-material/Info";
import Tooltip from "@mui/material/Tooltip";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import SettingsEthernetIcon from "@mui/icons-material/SettingsEthernet";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import SpeedIcon from "@mui/icons-material/Speed";
import RouterIcon from "@mui/icons-material/Router";
import MemoryIcon from "@mui/icons-material/Memory";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CastConnectedIcon from "@mui/icons-material/CastConnected";
import AppsIcon from "@mui/icons-material/Apps";
import type { OverridableComponent } from "@mui/material/OverridableComponent";
import type { SvgIconOwnProps, SvgIconTypeMap } from "@mui/material/SvgIcon";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import ArticleIcon from "@mui/icons-material/Article";
import DangerousIcon from "@mui/icons-material/Dangerous";
import { PortForward, useAppContext } from "../../app-context";
import ConfirmationDialog from "../../components/confirmation-dialog";
import { ResourceIcon } from "../../components";
import ContainerStatusList from "../../components/container-status-list";
import { TabComponentProps } from "../../layout/resource-details-page";

const PodOwnerLink = ({ kind, name }: { kind: string; name: string }) => {
  if (kind === "ReplicaSet") {
    return (
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        justifyContent="center"
      >
        <Typography fontSize="small">
          <ResourceIcon size={3} resourceName="ReplicaSet" />
        </Typography>
        <Link
          component={RouterLink}
          flex={1}
          to={`/replica-sets/${name}`}
          sx={{}}
        >
          <Typography variant="body1">{name} (replica set)</Typography>
        </Link>
      </Stack>
    );
  }

  if (kind === "Job") {
    return (
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        justifyContent="center"
      >
        <Typography fontSize="small">
          <ResourceIcon size={3} resourceName="Job" />
        </Typography>
        <Link component={RouterLink} flex={1} to={`/jobs/${name}`} sx={{}}>
          <Typography variant="body1">{name} (job)</Typography>
        </Link>
      </Stack>
    );
  }

  return null;
};

const PodStatusIconMapping: Record<
  string,
  OverridableComponent<SvgIconTypeMap<unknown, "svg">>
> = {
  Running: PlayCircleOutlineIcon,
  Terminating: HighlightOffIcon,
  Pending: HourglassEmptyIcon,
  Succeeded: CheckCircleOutlineIcon,
  Failed: ErrorOutlineIcon,
  Unknown: HelpOutlineIcon,
};

function PodStatusIcon({ status, color }: { status: string; color?: string }) {
  const StatusIcon = PodStatusIconMapping[status];

  if (!StatusIcon) {
    console.error(`No icon found for status: ${status}`);
    return null;
  }

  return (
    <StatusIcon
      aria-label="Pod status indicator"
      color={color as SvgIconOwnProps["color"]}
    />
  );
}

const PodGeneralTab: React.FC<TabComponentProps<V1Pod>> = ({
  resource: pod,
}) => {
  const { state, dispatch } = useAppContext();
  const { podName } = useParams<{ podName: string }>();
  const [requestDeletePod, setRequestDeletePod] = useState(false);
  const navigate = useNavigate();

  const { data: podOwner, isLoading: isPodOwnerLoading } = useQuery({
    queryKey: [
      "podOwner",
      {
        namespace: state.activeNamespace,
        name: podName,
        ctx: state.activeContext?.name,
      },
    ],
    queryFn: async () => {
      if (!podName || !state.activeNamespace) return;

      const owner = await window.k8sNavigator.getPodOwner(
        state.activeNamespace,
        podName,
      );
      const [[kind, name]] = Object.entries(owner);

      if (!kind || !name) return null;

      return { kind, name: name as string };
    },
    enabled: !!state.activeNamespace && !!podName,
  });

  const handleDeletePod = useCallback(async () => {
    if (!podName || !state.activeNamespace) return;

    await window.k8sNavigator.deletePod(state.activeNamespace, podName);
    navigate(-1);
  }, [navigate, podName, state.activeNamespace]);

  const [isPortForwardDialogOpen, setIsPortForwardDialogOpen] = useState(false);
  const [selectedPort, setSelectedPort] = useState("");
  const [userPort, setUserPort] = useState("");
  const [containerPort, setContainerPort] = useState("");
  const remotePort = containerPort || selectedPort;
  const hostPort = userPort || selectedPort;
  const [isPortForwardingError, setIsPortForwardingError] = useState(false);

  const handleOpenPortForwardDialog = (containerPort: string) => {
    setSelectedPort(containerPort);
    setIsPortForwardDialogOpen(true);
  };

  const handleClosePortForwardDialog = () => {
    setSelectedPort("");
    setUserPort("");
    setIsPortForwardDialogOpen(false);
  };

  const handleRequestDeletePodDialog = () => {
    setRequestDeletePod(false);
  };

  const handlePortForward = useCallback(async () => {
    if (!selectedPort) return;

    try {
      await window.k8sNavigator.portForward(
        state.activeNamespace,
        podName,
        remotePort,
        hostPort,
      );
      dispatch({
        type: "ADD_PORT_FORWARD",
        portForward: {
          namespace: state.activeNamespace,
          name: podName,
          targetPort: selectedPort,
          userPort: hostPort,
        },
      });
      handleClosePortForwardDialog();
      setIsPortForwardingError(false);
    } catch {
      setIsPortForwardingError(true);
    }
  }, [
    selectedPort,
    state.activeNamespace,
    podName,
    remotePort,
    hostPort,
    dispatch,
  ]);

  const handleClosePortForward = useCallback(
    (portForward: PortForward) => {
      async function fetchPortForwards() {
        const portForwards =
          await window.k8sNavigator.listForwardedPortServers();

        dispatch({ type: "SET_PORT_FORWARDS", portForwards });
      }

      window.k8sNavigator
        .closePortForward(
          state.activeNamespace,
          podName,
          portForward.targetPort,
          portForward.userPort,
        )
        .then(() => {
          dispatch({ type: "REMOVE_PORT_FORWARD", portForward });
          fetchPortForwards();
        });
    },

    [state.activeNamespace, dispatch, podName],
  );

  const podOpenPorts = Object.fromEntries(
    state.portForwards
      .filter((pf) => pf.name === podName)
      .map((pf) => [pf.targetPort, pf]),
  );
  const isTerminating = Boolean(pod?.metadata.deletionTimestamp);
  const podStatus = isTerminating
    ? "Terminating"
    : pod?.status?.phase || "Unknown";

  const isKillButtonDisabled = isTerminating || state.isReadOnly;
  let killButtonTooltip = "";
  if (state.isReadOnly) {
    killButtonTooltip = "In Read-Only mode. You can toggle this in settings.";
  }
  if (isTerminating) {
    killButtonTooltip = "Pod is terminating";
  }

  return (
    <>
      <Stack spacing={4}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={2} alignItems="center">
            <InfoIcon />
            <Typography variant="h6">Status</Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <PodStatusIcon
                color={isTerminating ? "error" : undefined}
                status={podStatus}
              />
              <Typography
                color={isTerminating ? "error" : undefined}
                variant="body1"
              >
                {podStatus}
              </Typography>
              <Tooltip title={killButtonTooltip}>
                <span>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DangerousIcon />}
                    onClick={() => setRequestDeletePod(true)}
                    disabled={isKillButtonDisabled}
                  >
                    Kill Pod
                  </Button>
                </span>
              </Tooltip>
            </Stack>
          </Stack>
        </Stack>
        {pod?.spec.serviceAccountName && (
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography fontSize="small">
              <ResourceIcon size={3} resourceName="ServiceAccount" />
            </Typography>
            <Typography variant="h6">Service Account</Typography>
            <Link
              component={RouterLink}
              flex={1}
              to={`/service-accounts/${pod.spec?.serviceAccountName}`}
              sx={{}}
            >
              <Typography variant="body1">
                {pod.spec?.serviceAccountName}
              </Typography>
            </Link>
          </Stack>
        )}
        {isPodOwnerLoading && <BarLoader />}
        {podOwner && <PodOwnerLink kind={podOwner.kind} name={podOwner.name} />}
        <Stack spacing={2}>
          <Stack direction="row" spacing={2} alignItems="center">
            <AppsIcon fontSize="small" />
            <Typography variant="h6">Containers</Typography>
          </Stack>
          <Stack spacing={4}>
            {pod?.spec.containers.map((container) => (
              <Stack key={container.name} spacing={1}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <TextFieldsIcon fontSize="small" />
                  <Typography width={60} variant="body1">
                    Name
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<ArticleIcon aria-label="View logs" />}
                    onClick={() =>
                      navigate(`/pods/${podName}/logs/${container.name}`)
                    }
                    sx={{
                      minWidth: 120,
                    }}
                  >
                    Logs
                  </Button>
                  <Typography>{container.name}</Typography>
                </Stack>
                <Stack direction="row" spacing={2}>
                  <SettingsEthernetIcon
                    fontSize="small"
                    aria-label="Container ports"
                  />
                  <Typography width={60} variant="body1">
                    Ports
                  </Typography>
                  <Stack spacing={1}>
                    {(container.ports || []).length === 0 && (
                      <Typography variant="body2">None</Typography>
                    )}
                    {container.ports?.map((port) => (
                      <Stack
                        key={`${port.containerPort}-${port.protocol}`}
                        direction="row"
                        spacing={3}
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Stack
                          direction="row"
                          spacing={0.5}
                          alignItems="center"
                        >
                          <Button
                            disabled={
                              !!podOpenPorts[port.containerPort] ||
                              port.protocol !== "TCP"
                            }
                            variant="outlined"
                            startIcon={<SendIcon aria-label="Forward port" />}
                            onClick={() =>
                              handleOpenPortForwardDialog(
                                port.containerPort.toString(),
                              )
                            }
                            sx={{
                              minWidth: 120,
                            }}
                          >
                            Forward
                          </Button>
                          {podOpenPorts[port.containerPort] && (
                            <Button
                              variant="outlined"
                              startIcon={
                                <DeleteIcon aria-label="Close forwarded port" />
                              }
                              onClick={() =>
                                handleClosePortForward(
                                  podOpenPorts[port.containerPort],
                                )
                              }
                            >
                              {"~> "}
                              {podOpenPorts[port.containerPort].userPort}
                            </Button>
                          )}
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <RouterIcon
                            fontSize="small"
                            aria-label="Port forwarding"
                          />
                          <Typography>{port.containerPort}</Typography>
                          <CastConnectedIcon fontSize="small" />
                          <Typography>{port.protocol}</Typography>
                        </Stack>
                      </Stack>
                    ))}
                  </Stack>
                </Stack>

                {/* Image */}
                <Stack direction="row" spacing={2}>
                  <InsertDriveFileIcon
                    aria-label="Container image"
                    fontSize="small"
                  />
                  <Typography width={60} variant="body1">
                    Image
                  </Typography>
                  <Typography>{container.image}</Typography>
                </Stack>
                {/* CPU */}
                <Stack direction="row" spacing={2}>
                  <SpeedIcon aria-label="CPU usage" fontSize="small" />
                  <Typography width={60} variant="body1">
                    CPU
                  </Typography>
                  <Typography>
                    {container.resources?.requests?.cpu || "no-request"}/
                    {container.resources?.limits?.cpu || "no-limit"}
                  </Typography>
                </Stack>
                {/* Memory */}
                <Stack direction="row" spacing={2}>
                  <MemoryIcon aria-label="Memory usage" fontSize="small" />
                  <Typography width={60} variant="body1">
                    Memory
                  </Typography>
                  <Typography>
                    {container.resources?.requests?.memory || "no-request"}/
                    {container.resources?.limits?.memory || "no-limit"}
                  </Typography>
                </Stack>
              </Stack>
            ))}
          </Stack>
        </Stack>

        <ContainerStatusList statuses={pod?.status.containerStatuses} />
      </Stack>

      <ConfirmationDialog
        isOpen={isPortForwardDialogOpen}
        onClose={handleClosePortForwardDialog}
        onConfirm={handlePortForward}
        title="Port Forwarding Setup"
        primaryButtonText="Port forward"
        primaryButtonColor="primary"
      >
        <Stack spacing={2}>
          <Typography variant="body1">
            You are about to forward a container port to a local port on your
            system. Please review the details below:
          </Typography>
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="body1">Container Port:</Typography>
            <TextField
              type="number"
              color={isPortForwardingError ? "error" : undefined}
              error={isPortForwardingError}
              value={remotePort}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setContainerPort(e.target.value)
              }
            />
          </Stack>
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="body1">Local Port:</Typography>
            <TextField
              type="number"
              color={isPortForwardingError ? "error" : undefined}
              error={isPortForwardingError}
              value={hostPort}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setUserPort(e.target.value)
              }
            />
          </Stack>
          <Typography variant="body1">
            Please ensure that the local port you enter is available and not
            already in use by another application.
          </Typography>
        </Stack>
      </ConfirmationDialog>
      <ConfirmationDialog
        isOpen={requestDeletePod}
        title="Delete Pod"
        onClose={handleRequestDeletePodDialog}
        onConfirm={handleDeletePod}
        primaryButtonText="Delete"
        primaryButtonColor="error"
      >
        <Stack spacing={2}>
          <Typography variant="body1">
            Are you sure you want to delete the following pod?:
          </Typography>
          <Typography color="error" variant="body2">
            {podName}
          </Typography>
          <Typography variant="body1">
            You are currently in the context:
          </Typography>
          <Typography color="error" variant="body2">
            {state.activeContext?.name}
          </Typography>
          <Typography variant="body1">and in the namespace:</Typography>
          <Typography color="error" variant="body2">
            {state.activeNamespace}.
          </Typography>
          {podOwner?.name ? (
            <Stack spacing={2}>
              <Typography variant="body1">This pod is manged by:</Typography>
              <Typography variant="overline">
                {podOwner.name} ({podOwner.kind})
              </Typography>
            </Stack>
          ) : (
            <Typography variant="body1">
              This pod is not managed by any resource
            </Typography>
          )}
        </Stack>
      </ConfirmationDialog>
    </>
  );
};

export default PodGeneralTab;

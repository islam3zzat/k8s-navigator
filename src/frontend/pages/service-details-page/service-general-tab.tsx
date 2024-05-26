import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { V1Service, V1ServicePort } from "@kubernetes/client-node";
import DnsIcon from "@mui/icons-material/Dns";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import RouterIcon from "@mui/icons-material/Router";
import { useAppContext } from "../../app-context";
import { EndpointsList, PodsList } from "../../components";

const formatPort = (svcPort: V1ServicePort): string => {
  const name = svcPort.name;
  const protocol = svcPort.protocol;
  const targetPort = svcPort.targetPort;
  const nodePort = svcPort.nodePort;
  const port = svcPort.port;
  const appProtocol = svcPort.appProtocol;

  return [
    name,
    `${port}/${protocol}`,
    targetPort && `targetPort: ${targetPort}`,
    nodePort && `nodePort: ${nodePort}`,
    appProtocol && `appProtocol: ${appProtocol}`,
  ]
    .filter(Boolean)
    .join(" - ");
};

const ServiceGeneralTab = ({ resource: service }: { resource: V1Service }) => {
  const { state } = useAppContext();

  const namespace = state.activeNamespace;

  return (
    <Stack spacing={4}>
      <Stack spacing={2}>
        <Stack direction="row" spacing={2} alignItems="center">
          <InsertDriveFileIcon aria-label="Service type" fontSize="small" />
          <Typography variant="h6">Type</Typography>
          <Typography>{service?.spec?.type}</Typography>
        </Stack>
      </Stack>
      <Stack spacing={2}>
        <Stack direction="row" spacing={2} alignItems="center">
          <DnsIcon aria-label="Cluster IP" fontSize="small" />
          <Typography variant="h6">Cluster IP</Typography>
          <Typography>{service?.spec?.clusterIP}</Typography>
        </Stack>
      </Stack>
      <Stack spacing={2}>
        <Stack direction="row" spacing={2} alignItems="center">
          <RouterIcon aria-label="Service ports" fontSize="small" />
          <Typography variant="h6">Ports</Typography>
          <Stack spacing={2}>
            {service?.spec?.ports?.map((port) => (
              <Typography key={port.port}>{formatPort(port)}</Typography>
            ))}
          </Stack>
        </Stack>
      </Stack>

      {service?.spec?.selector && (
        <>
          <Stack spacing={2}>
            <Typography variant="h5">Target Pods</Typography>
            <PodsList namespace={namespace} selector={service.spec.selector} />
          </Stack>
          <Stack spacing={2}>
            <Typography variant="h5">Endpoints</Typography>
            <EndpointsList
              namespace={namespace}
              selector={service.spec.selector}
            />
          </Stack>
        </>
      )}
    </Stack>
  );
};

export default ServiceGeneralTab;

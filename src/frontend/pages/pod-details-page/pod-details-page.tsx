import { useParams } from "react-router-dom";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { V1Pod } from "@kubernetes/client-node";
import React from "react";
import PodGeneralTab from "./pod-general-tab";
import { ContainerStatusList, EnvVarsList } from "../../components";
import {
  ResourceDetailsPage,
  TabComponentProps,
} from "../../layout/resource-details-page";

const ContainersStatusTab: React.FC<TabComponentProps<V1Pod>> = ({
  resource: pod,
}) => {
  return (
    <Stack spacing={2}>
      <Typography variant="h6">Containers Status</Typography>
      <ContainerStatusList statuses={pod?.status.containerStatuses} />
    </Stack>
  );
};

const EnvironmentVariablesTab: React.FC<TabComponentProps<V1Pod>> = ({
  resource: pod,
}) => {
  return (
    <Stack spacing={4}>
      {pod?.spec?.containers.map((container) => (
        <Stack key={container.name} spacing={2}>
          <Typography variant="h6">{container.name}</Typography>
          <EnvVarsList envs={container.env} />
        </Stack>
      ))}
    </Stack>
  );
};
const PodDetailsPage = () => {
  const { podName } = useParams<{ podName: string }>();

  return (
    <ResourceDetailsPage
      name={podName}
      resourceKind="pod"
      tabs={[
        {
          label: "General",
          slot: PodGeneralTab,
        },
        {
          label: "Environment Variables",
          slot: EnvironmentVariablesTab,
        },
        {
          label: "Containers Status",
          slot: ContainersStatusTab,
        },
      ]}
      routeOptions={{
        path: "/pods/" + podName,
        label: "Pod Details",
        iconName: "Pod",
      }}
    />
  );
};
export default PodDetailsPage;

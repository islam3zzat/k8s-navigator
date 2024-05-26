import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { V1Deployment } from "@kubernetes/client-node";
import { EnvVarsList } from "../../components";

const EnvironmentVariablesTab = ({
  resource: deployment,
}: {
  resource: V1Deployment;
}) => {
  return (
    <Stack spacing={4}>
      {deployment?.spec?.template.spec.containers.map((container) => (
        <Stack key={container.name} spacing={2}>
          <Typography variant="h6">{container.name}</Typography>
          <EnvVarsList envs={container.env} />
        </Stack>
      ))}
    </Stack>
  );
};

export default EnvironmentVariablesTab;

import Stack from "@mui/material/Stack";
import {
  V1ConfigMap,
  V1CronJob,
  V1Deployment,
  V1Job,
  V1Pod,
  V1ReplicaSet,
  V1Secret,
  V1Service,
  V1ServiceAccount,
} from "@kubernetes/client-node";
import { ResourceLabels } from "../../components";

export const LabelsTab = ({
  resource,
}: {
  resource:
    | V1ConfigMap
    | V1CronJob
    | V1Deployment
    | V1Job
    | V1Pod
    | V1ReplicaSet
    | V1Secret
    | V1ServiceAccount
    | V1Service;
}) => {
  const labels = resource?.metadata?.labels || {};
  const annotations = resource?.metadata?.annotations || {};

  if (!labels && !annotations) {
    return null;
  }

  return (
    <Stack spacing={4}>
      {labels && <ResourceLabels title="Labels" values={labels} />}
      {annotations && (
        <ResourceLabels title="Annotation" values={annotations} />
      )}
    </Stack>
  );
};

import DoneAllIcon from "@mui/icons-material/DoneAll";
import TaskIcon from "@mui/icons-material/Task";
import CancelIcon from "@mui/icons-material/Cancel";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Link as RouterLink } from "react-router-dom";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { V1Job } from "@kubernetes/client-node";
import Link from "@mui/material/Link";
import { PodsList, ResourceIcon } from "../../components";
import { useAppContext } from "../../app-context";
import CronJob from "../../icons/resources/unlabeled/cronjob.svg";

const JobGeneralTab = ({ resource: job }: { resource: V1Job }) => {
  const { state } = useAppContext();

  const namespace = state.activeNamespace;

  const cronJobName = job?.metadata?.ownerReferences?.[0]?.name;

  return (
    <Stack spacing={4}>
      <Stack spacing={2}>
        <Stack direction="row" spacing={2} alignItems="center">
          <ResourceIcon resourceName="CronJob" size={2.5} />
          <Typography variant="h6" width={150}>
            Controlled By
          </Typography>
          <Link component={RouterLink} to={`/cron-jobs/${cronJobName}`}>
            <Typography>{job?.metadata?.ownerReferences?.[0]?.name}</Typography>
          </Link>
        </Stack>
      </Stack>
      <Stack spacing={2}>
        <Stack direction="row" spacing={2} alignItems="center">
          <CompareArrowsIcon aria-label="Parallelism" fontSize="small" />
          <Typography variant="h6" width={150}>
            Parallelism
          </Typography>
          <Typography>{job?.spec?.parallelism}</Typography>
        </Stack>
      </Stack>
      <Stack spacing={2}>
        <Stack direction="row" spacing={2} alignItems="center">
          <DoneAllIcon aria-label="Completions" fontSize="small" />
          <Typography variant="h6" width={150}>
            Completions
          </Typography>
          <Stack spacing={2}>
            <Stack direction="row" spacing={2}>
              <CheckCircleIcon fontSize="small" />
              <Typography width={80}>Succeeded</Typography>
              <Typography>{job?.status?.succeeded || 0}</Typography>
            </Stack>
            <Stack direction="row" spacing={2}>
              <CancelIcon
                aria-label="Failed completions"
                color={job?.status?.failed ? "error" : undefined}
                fontSize="small"
              />
              <Typography
                width={80}
                color={job?.status?.failed ? "error" : undefined}
              >
                Failed
              </Typography>
              <Typography color={job?.status?.failed ? "error" : undefined}>
                {job?.status?.failed || 0}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={2}>
              <TaskIcon aria-label="Planned completions" fontSize="small" />
              <Typography width={80}>Planned</Typography>
              <Typography>{job?.spec?.completions || 0}</Typography>
            </Stack>
          </Stack>
        </Stack>
      </Stack>

      {job?.spec?.selector.matchLabels && (
        <Stack spacing={2}>
          <Typography variant="h5">Target Pods</Typography>
          <PodsList
            namespace={namespace}
            selector={job.spec.selector.matchLabels}
          />
        </Stack>
      )}
    </Stack>
  );
};

export default JobGeneralTab;

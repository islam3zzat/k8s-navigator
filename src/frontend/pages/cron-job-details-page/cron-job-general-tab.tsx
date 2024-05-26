import DoneAllIcon from "@mui/icons-material/DoneAll";
import PauseCircleFilledIcon from "@mui/icons-material/PauseCircleFilled";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ScheduleIcon from "@mui/icons-material/Schedule";
import HistoryIcon from "@mui/icons-material/History";
import cronstrue from "cronstrue";
import { V1CronJob } from "@kubernetes/client-node";
import { JobsList } from "../../components";
import { useAppContext } from "../../app-context";

const CronJobGeneralTab = ({ resource: cronJob }: { resource: V1CronJob }) => {
  const { state } = useAppContext();

  const jobLabels = cronJob?.spec?.jobTemplate?.spec?.template?.metadata.labels;

  const namespace = state.activeNamespace;

  return (
    <Stack spacing={4}>
      <Stack spacing={2}>
        <Stack direction="row" spacing={2} alignItems="center">
          <ScheduleIcon fontSize="small" aria-label="Schedule" />
          <Typography variant="h6" width={200}>
            Schedule
          </Typography>
          <Typography>
            {cronJob?.spec?.schedule
              ? cronstrue.toString(cronJob?.spec?.schedule)
              : "None"}
          </Typography>
        </Stack>
      </Stack>

      <Stack spacing={2}>
        <Stack direction="row" spacing={2} alignItems="center">
          <DoneAllIcon aria-label="Concurrency policy" fontSize="small" />
          <Typography variant="h6" width={200}>
            Concurrency Policy
          </Typography>
          <Typography>{cronJob?.spec?.concurrencyPolicy}</Typography>
        </Stack>
      </Stack>
      <Stack spacing={2}>
        <Stack direction="row" spacing={2} alignItems="center">
          <PauseCircleFilledIcon aria-label="Suspend" fontSize="small" />
          <Typography variant="h6" width={200}>
            Suspend
          </Typography>
          <Typography>{cronJob?.spec?.suspend ? "True" : "False"}</Typography>
        </Stack>
      </Stack>
      <Stack spacing={2}>
        <Stack direction="row" spacing={2} alignItems="center">
          <HistoryIcon aria-label="Job history limit" fontSize="small" />
          <Typography variant="h6" width={200}>
            Successful Job History Limit
          </Typography>
          <Typography>{cronJob?.spec?.successfulJobsHistoryLimit}</Typography>
        </Stack>
      </Stack>
      <Stack spacing={2}>
        <Stack direction="row" spacing={2} alignItems="center">
          <HistoryIcon fontSize="small" />
          <Typography variant="h6" width={200}>
            Failed Job History Limit
          </Typography>
          <Typography>{cronJob?.spec?.failedJobsHistoryLimit}</Typography>
        </Stack>
      </Stack>

      {jobLabels && (
        <Stack spacing={2}>
          <Typography variant="h5">Jobs</Typography>
          <JobsList namespace={namespace} selector={jobLabels} />
        </Stack>
      )}
    </Stack>
  );
};

export default CronJobGeneralTab;

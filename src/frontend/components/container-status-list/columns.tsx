import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import { V1ContainerStatus } from "@kubernetes/client-node";
import { Stack, Typography } from "@mui/material";
import { Column } from "../data-table";

const stateSortMap = {
  waiting: 1,
  running: 2,
  completed: 3,
  terminated: 4,
};
function getContainerState(
  cs: V1ContainerStatus,
): "waiting" | "running" | "completed" | "terminated" {
  if (cs.state.waiting?.message) {
    return "waiting";
  }

  if (cs.state.terminated?.finishedAt) {
    if (cs.state.terminated?.exitCode === 0) return "completed";

    return "terminated";
  }

  return "running";
}
function StatusIcon({
  state,
}: {
  state: "waiting" | "running" | "completed" | "terminated";
}) {
  switch (state) {
    case "waiting":
      return <WarningAmberIcon color="warning" />;
    case "running":
      return <PlayCircleOutlineIcon color="primary" />;
    case "completed":
      return <PlayCircleOutlineIcon color="success" />;
    case "terminated":
      return <ErrorOutlineIcon color="error" />;

    default:
      return <QuestionMarkIcon />;
  }
}

function getContainerStateReason(cs: V1ContainerStatus): string {
  if (cs.state.waiting?.reason) {
    return cs.state.waiting.reason;
  }

  if (cs.state.terminated?.reason) {
    return cs.state.terminated.reason;
  }

  return "N/A";
}
export const columns: Column<V1ContainerStatus>[] = [
  {
    name: "Name",
    getData: (cs) => cs.name,
    compare(a, b) {
      return a.name.localeCompare(b.name);
    },
  },
  {
    name: "Ready",
    getData: (cs) => {
      if (cs.ready) {
        return <Typography color="primary">Ready</Typography>;
      }

      return <Typography color="error">Not Ready</Typography>;
    },
    getSearchableString(cs) {
      return cs.ready ? "ready" : "not ready";
    },
    compare(a, b) {
      return Number(a.ready) - Number(b.ready);
    },
  },
  {
    name: "Restart Count",
    getData: (cs) => {
      if (cs.restartCount > 0) {
        return <Typography color="orange">{cs.restartCount}</Typography>;
      }

      return <Typography color="primary">{cs.restartCount}</Typography>;
    },
    compare(a, b) {
      return a.restartCount - b.restartCount;
    },
  },
  {
    name: "Started",
    getData: (cs) => {
      if (cs.started) {
        return <Typography color="primary">Started</Typography>;
      }

      return <Typography color="error">Not Started</Typography>;
    },
    getSearchableString(cs) {
      return cs.started ? "started" : "not started";
    },
    compare(a, b) {
      return Number(a.started) - Number(b.started);
    },
  },
  {
    name: "State",
    getData: (cs) => {
      const state = getContainerState(cs);
      if (state === "waiting") {
        return (
          <Stack spacing={1} direction="row" justifyContent="space-between">
            <Typography color="orange">Waiting</Typography>
            <StatusIcon state={state} />
          </Stack>
        );
      }

      if (state === "terminated") {
        return (
          <Stack spacing={1} direction="row" justifyContent="space-between">
            <Typography color="orange">Terminated</Typography>
            <StatusIcon state={state} />
          </Stack>
        );
      }

      if (state === "completed") {
        return (
          <Stack spacing={1} direction="row" justifyContent="space-between">
            <Typography color="success">Completed</Typography>
            <StatusIcon state={state} />
          </Stack>
        );
      }

      if (state === "running") {
        return (
          <Stack spacing={1} direction="row" justifyContent="space-between">
            <Typography color="primary">Running</Typography>
            <StatusIcon state={state} />
          </Stack>
        );
      }

      return (
        <Stack spacing={1} direction="row" justifyContent="space-between">
          <Typography>{state}</Typography>
          <StatusIcon state={state} />
        </Stack>
      );
    },
    compare(a, b) {
      const stateA = getContainerState(a);
      const stateB = getContainerState(b);

      return ((stateSortMap[stateA] as number) -
        stateSortMap[stateB]) as number;
    },
    getSearchableString(cs) {
      return getContainerState(cs);
    },
  },
  {
    name: "Reason",
    getData: (cs) => getContainerStateReason(cs),
    compare(a, b) {
      return getContainerStateReason(a).localeCompare(
        getContainerStateReason(b),
      );
    },
  },
];

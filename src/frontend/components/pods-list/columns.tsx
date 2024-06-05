import { V1Pod } from "@kubernetes/client-node";
import moment, { duration as momentDuration } from "moment";
import { Typography } from "@mui/material";
import { Column } from "../data-table";

export const columns: Column<V1Pod>[] = [
  {
    name: "Name",
    getData: (p: V1Pod) => p.metadata.name,
    compare(a, b) {
      return a.metadata.name.localeCompare(b.metadata.name);
    },
  },
  {
    name: "Ready",
    getData: (p: V1Pod) => {
      const status = p.status;
      if (!status) return "";
      const containersCount = status.containerStatuses?.length || 0;
      const readyCount =
        status.containerStatuses?.filter((c) => c.ready).length || 0;

      return `${readyCount}/${containersCount}`;
    },
    compare(a: V1Pod, b: V1Pod) {
      const containersCountA = a.status?.containerStatuses?.length || 0;
      const readyCountA =
        a.status?.containerStatuses?.filter((c) => c.ready).length || 0;

      const containersCountB = b.status?.containerStatuses?.length || 0;
      const readyCountB =
        b.status?.containerStatuses?.filter((c) => c.ready).length || 0;

      return readyCountA / containersCountA - readyCountB / containersCountB;
    },
  },
  {
    name: "Status",
    getData: (p: V1Pod) => {
      const status = p.status;
      if (!status) return "";
      const isTerminating = p.metadata.deletionTimestamp !== undefined;
      if (isTerminating) {
        return <Typography color="error">Terminating</Typography>;
      }

      const greenPhases = ["Running", "Succeeded"];
      const yellowPhases = ["Pending"];
      if (greenPhases.includes(status.phase)) {
        return <Typography color="primary">{status.phase}</Typography>;
      }

      if (yellowPhases.includes(status.phase)) {
        return <Typography color="orange">{status.phase}</Typography>;
      }

      return <Typography color="error">{status.phase}</Typography>;
    },
    getSearchableString: (p: V1Pod) =>
      p.metadata.deletionTimestamp ? "Terminating" : p.status?.phase || "",
    compare(a: V1Pod, b: V1Pod) {
      const phaseA = a.status?.phase || "Unknown";
      const phaseB = b.status?.phase || "Unknown";

      return phaseA.localeCompare(phaseB);
    },
  },
  {
    name: "Message",
    getData: (p: V1Pod) => {
      return p.status?.message || "";
    },
    compare(a, b) {
      return a.status?.message?.localeCompare(b.status?.message || "");
    },
  },
  {
    name: "Restarts",
    getData: (p: V1Pod) => {
      return p.status?.containerStatuses?.reduce(
        (acc, c) => acc + (c.restartCount || 0),
        0,
      );
    },
    compare(a: V1Pod, b: V1Pod) {
      const restartsA = a.status?.containerStatuses?.reduce(
        (acc, c) => acc + (c.restartCount || 0),
        0,
      );
      const restartsB = b.status?.containerStatuses?.reduce(
        (acc, c) => acc + (c.restartCount || 0),
        0,
      );

      return restartsA - restartsB;
    },
  },
  {
    name: "Age",
    getData: (p: V1Pod) => {
      const created = moment(p.metadata.creationTimestamp || "");
      const now = moment();
      const duration = momentDuration(now.diff(created));
      const days = duration.asDays();
      const hours = duration.asHours();
      const minutes = duration.asMinutes();
      const seconds = duration.asSeconds();

      if (days > 1) {
        return `${days.toFixed(1)}d`;
      } else if (hours > 1) {
        return `${hours.toFixed(1)}h`;
      } else if (minutes > 1) {
        return `${minutes.toFixed(1)}m`;
      } else {
        return `${seconds.toFixed(1)}s`;
      }
    },
    compare(a, b) {
      const createdA = new Date(a.metadata.creationTimestamp || "").getTime();
      const createdB = new Date(b.metadata.creationTimestamp || "").getTime();

      return createdA - createdB;
    },
  },
];

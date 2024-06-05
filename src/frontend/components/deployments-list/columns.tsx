import moment, { duration as momentDuration } from "moment";
import { V1Deployment } from "@kubernetes/client-node";
import Typography from "@mui/material/Typography";
import { Column } from "../data-table";

export const columns: Column<V1Deployment>[] = [
  {
    name: "Name",
    getData: (d: V1Deployment) => d.metadata.name,
    compare(a, b) {
      return a.metadata.name.localeCompare(b.metadata.name);
    },
  },
  {
    name: "Ready",
    getData: (d: V1Deployment) => {
      const status = d.status;
      if (!status) return "";
      const ready = status.readyReplicas || 0;
      const replicas = status.replicas || 0;

      let color = "primary";

      if (ready !== replicas) {
        color = "error";
      }

      return (
        <Typography color={color}>
          {ready}/{replicas}
        </Typography>
      );
    },
    getSearchableString(d) {
      const status = d.status;
      if (!status) return "";
      const ready = status.readyReplicas || 0;
      const replicas = status.replicas || 0;

      return `${ready}/${replicas}`;
    },
    compare(a, b) {
      const readyA = a.status?.readyReplicas || 0;
      const readyB = b.status?.readyReplicas || 0;
      return readyA - readyB;
    },
  },
  {
    name: "Up-to-date",
    getData: (d: V1Deployment) => {
      const status = d.status;
      if (!status) return "";

      return status.updatedReplicas || 0;
    },
    compare(a, b) {
      const updatedA = a.status?.updatedReplicas || 0;
      const updatedB = b.status?.updatedReplicas || 0;
      return updatedA - updatedB;
    },
  },
  {
    name: "Available",
    getData: (d: V1Deployment) => {
      const status = d.status;
      if (!status) return "";

      return status.availableReplicas || 0;
    },
    compare(a, b) {
      const availableA = a.status?.availableReplicas || 0;
      const availableB = b.status?.availableReplicas || 0;
      return availableA - availableB;
    },
  },
  {
    name: "Age",
    getData: (d: V1Deployment) => {
      const created = moment(d.metadata.creationTimestamp || "");
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

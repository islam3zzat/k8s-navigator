import { V1Job } from "@kubernetes/client-node";
import moment from "moment";
import { Column } from "../data-table";

export const columns: Column<V1Job>[] = [
  {
    name: "Name",
    getData: (p) => p.metadata.name,
    compare(a, b) {
      return a.metadata.name.localeCompare(b.metadata.name);
    },
  },
  {
    name: "Completions",
    getData: (j) => {
      const specCompletions = j.spec?.completions;
      const statusSucceeded = j.status?.succeeded || 0;
      if (specCompletions === 0) {
        return "N/A";
      }

      return `${statusSucceeded}/${specCompletions}`;
    },
    compare(a, b) {
      return a.status?.succeeded - b.status?.succeeded;
    },
  },
  {
    name: "Failed",
    getData: (j) => j.status?.failed || 0,
    compare(a, b) {
      return (a.status.failed || 0) - (b.status.failed || 0);
    },
  },
  {
    name: "Duration",
    getData: (j) => {
      const startTime = j.status?.startTime;
      const completionTime = j.status?.completionTime;

      if (!startTime || !completionTime) {
        return "N/A";
      }

      const duration = moment.duration(
        moment(completionTime).diff(moment(startTime)),
      );

      const hours = duration.hours();
      const minutes = duration.minutes();
      const seconds = duration.seconds();

      return `${hours}h ${minutes}m ${seconds}s`;
    },
    compare(a, b) {
      const startTimeA = new Date(a.status.startTime || "").getTime();
      const startTimeB = new Date(b.status.startTime || "").getTime();

      return startTimeA - startTimeB;
    },
  },
  {
    name: "Parallelism",
    getData: (p) => p.spec?.parallelism,
    compare(a, b) {
      return a.spec.parallelism - b.spec.parallelism;
    },
  },
  {
    name: "Age",
    getData: (p) => {
      const created = moment(p.metadata.creationTimestamp || "");
      const now = moment();
      const duration = moment.duration(now.diff(created));
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

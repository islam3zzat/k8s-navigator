import { V1Secret } from "@kubernetes/client-node";
import moment, { duration as momentDuration } from "moment";
import { Column } from "../data-table";

export const columns: Column<V1Secret>[] = [
  {
    name: "Name",
    getData: (p) => p.metadata.name,
    compare(a, b) {
      return a.metadata.name.localeCompare(b.metadata.name);
    },
  },
  {
    name: "Type",
    getData: (p) => p.type,
    compare(a, b) {
      return a.type.localeCompare(b.type);
    },
  },
  {
    name: "Data",
    getData: (p) => {
      const keys = p.data ? Object.keys(p.data) : [];
      return keys.length;
    },
    compare(a, b) {
      return (
        Object.keys(a.data || {}).length - Object.keys(b.data || {}).length
      );
    },
  },
  {
    name: "Age",
    getData: (p) => {
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

import { V1ServiceAccount } from "@kubernetes/client-node";
import moment, { duration as momentDuration } from "moment";
import { Column } from "../data-table";

export const columns: Column<V1ServiceAccount>[] = [
  {
    name: "Name",
    getData: (p) => p.metadata.name,
    compare(a, b) {
      return a.metadata.name.localeCompare(b.metadata.name);
    },
  },
  {
    name: "Secrets",
    getData: (p) => {
      const secrets = p.secrets || [];
      return secrets.length;
    },
    compare(a, b) {
      return a.secrets?.length ?? 0 - b.secrets?.length ?? 0;
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

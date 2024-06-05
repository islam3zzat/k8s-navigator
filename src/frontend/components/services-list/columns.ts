import { V1Service } from "@kubernetes/client-node";
import moment, { duration as momentDuration } from "moment";
import { Column } from "../data-table";

const getPortsColumn = (svc: V1Service) => {
  return svc.spec?.ports
    ?.map((port) => {
      const nodePort = port.nodePort;

      if (typeof nodePort === "number") {
        return `${port.port}:${nodePort}/${port.protocol}`;
      }

      return `${port.port}/${port.protocol}`;
    })
    .join(", ");
};

export const columns: Column<V1Service>[] = [
  {
    name: "Name",
    getData: (p) => p.metadata.name,
    compare(a, b) {
      return a.metadata.name.localeCompare(b.metadata.name);
    },
  },
  {
    name: "Type",
    getData: (svc) => svc.spec?.type,
    compare(a, b) {
      return a.spec.type.localeCompare(b.spec.type);
    },
  },
  {
    name: "Cluster IP",
    getData: (svc) => svc.spec?.clusterIP,
    compare(a, b) {
      return a.spec.clusterIP.localeCompare(b.spec.clusterIP);
    },
  },
  {
    name: "External IP",
    getData: (svc) => svc.spec?.externalIPs?.join(", ") || "None",
    compare(a, b) {
      return (a.spec.externalIPs?.join(", ") || "None").localeCompare(
        b.spec.externalIPs?.join(", ") || "None",
      );
    },
  },
  {
    name: "Port(s)",
    getData: (svc) => getPortsColumn(svc),
    compare(a, b) {
      return getPortsColumn(a).localeCompare(getPortsColumn(b));
    },
  },
  {
    name: "Target Port",
    getData: (svc) => {
      return svc.spec?.ports?.map((port) => port.targetPort).join(", ");
    },
    compare(a, b) {
      return a.spec.ports
        .map((port) => port.targetPort)
        .join(", ")
        .localeCompare(b.spec.ports.map((port) => port.targetPort).join(", "));
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

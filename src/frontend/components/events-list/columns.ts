import { CoreV1Event } from "@kubernetes/client-node";
import moment from "moment";
import { Column } from "../data-table";

export const columns: Column<CoreV1Event>[] = [
  {
    name: "Last Seen",
    getData: (e: CoreV1Event) => moment(e.lastTimestamp).fromNow(),
    compare(a: CoreV1Event, b: CoreV1Event) {
      return moment(a.lastTimestamp).diff(moment(b.lastTimestamp));
    },
  },
  {
    name: "Type",
    getData: (e: CoreV1Event) => e.type,
    compare(a: CoreV1Event, b: CoreV1Event) {
      return a.type.localeCompare(b.type);
    },
  },
  {
    name: "Reason",
    getData: (e: CoreV1Event) => e.reason,
    compare(a: CoreV1Event, b: CoreV1Event) {
      return a.reason.localeCompare(b.reason);
    },
  },
  {
    name: "Message",
    getData: (e: CoreV1Event) => e.message,
    compare(a: CoreV1Event, b: CoreV1Event) {
      return a.message.localeCompare(b.message);
    },
  },
  {
    name: "Source",
    getData: (e: CoreV1Event) => e.source.component,
    compare(a: CoreV1Event, b: CoreV1Event) {
      return a.source.component.localeCompare(b.source.component);
    },
  },
];

import { V1CronJob } from "@kubernetes/client-node";
import moment, { duration as momentDuration } from "moment";
import { toString } from "cronstrue";
import { Column } from "../data-table";

const fromatSchedule = (schedule: string) => {
  if (!schedule) return "N/A";

  return toString(schedule);
};
export const columns: Column<V1CronJob>[] = [
  {
    name: "Name",
    getData: (p) => p.metadata.name,
    compare(a, b) {
      return a.metadata.name.localeCompare(b.metadata.name);
    },
  },
  {
    name: "Schedule",
    getData: (cj) => fromatSchedule(cj.spec?.schedule),
    compare(cjA, cjB) {
      const scheduleA = fromatSchedule(cjA.spec?.schedule);
      const scheduleB = fromatSchedule(cjB.spec?.schedule);

      return scheduleA.localeCompare(scheduleB);
    },
  },
  {
    name: "Active",
    getData: (p) => p.status?.active?.length || 0,
    compare(a, b) {
      return (a.status.active?.length || 0) - (b.status.active?.length || 0);
    },
  },
  {
    name: "Last Schedule",
    getData: (p) => {
      const lastSchedule = p.status?.lastScheduleTime;
      if (!lastSchedule) {
        return "N/A";
      }

      return moment(lastSchedule).fromNow();
    },
    compare(a, b) {
      const lastScheduleA = new Date(a.status.lastScheduleTime || "").getTime();
      const lastScheduleB = new Date(b.status.lastScheduleTime || "").getTime();

      return lastScheduleA - lastScheduleB;
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

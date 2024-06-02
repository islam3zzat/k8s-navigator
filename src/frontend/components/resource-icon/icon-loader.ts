import { ComponentType } from "react";

const iconLoader = {
  Deployment: () => import("../../icons/resources/unlabeled/deploy.svg"),
  Pod: () => import("../../icons/resources/unlabeled/pod.svg"),
  CronJob: () => import("../../icons/resources/unlabeled/cronjob.svg"),
  Service: () => import("../../icons/resources/unlabeled/svc.svg"),
  Job: () => import("../../icons/resources/unlabeled/job.svg"),
  ServiceAccount: () => import("../../icons/resources/unlabeled/sa.svg"),
  ConfigMap: () => import("../../icons/resources/unlabeled/cm.svg"),
  Secret: () => import("../../icons/resources/unlabeled/secret.svg"),
  ReplicaSet: () => import("../../icons/resources/unlabeled/rs.svg"),
};

export type ResourceName = keyof typeof iconLoader;

export default iconLoader as Record<
  ResourceName,
  () => Promise<{ default: ComponentType<unknown> }>
>;

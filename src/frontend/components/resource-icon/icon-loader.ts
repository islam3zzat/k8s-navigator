import { FC, lazy, Suspense } from "react";

const iconLoader = {
  // @ts-expect-error untyped lazy import
  Deployment: lazy(() => import("../../icons/resources/unlabeled/deploy.svg")),
  // @ts-expect-error untyped lazy import
  Pod: lazy(() => import("../../icons/resources/unlabeled/pod.svg")),
  // @ts-expect-error untyped lazy import
  CronJob: lazy(() => import("../../icons/resources/unlabeled/cronjob.svg")),
  // @ts-expect-error untyped lazy import
  Service: lazy(() => import("../../icons/resources/unlabeled/svc.svg")),
  // @ts-expect-error untyped lazy import
  Job: lazy(() => import("../../icons/resources/unlabeled/job.svg")),
  // @ts-expect-error untyped lazy import
  ServiceAccount: lazy(() => import("../../icons/resources/unlabeled/sa.svg")),
  // @ts-expect-error untyped lazy import
  ConfigMap: lazy(() => import("../../icons/resources/unlabeled/cm.svg")),
  // @ts-expect-error untyped lazy import
  Secret: lazy(() => import("../../icons/resources/unlabeled/secret.svg")),
  // @ts-expect-error untyped lazy import
  ReplicaSet: lazy(() => import("../../icons/resources/unlabeled/rs.svg")),
};

export type ResourceName = keyof typeof iconLoader;

export default iconLoader;

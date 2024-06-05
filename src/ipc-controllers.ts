import * as k8s from "@kubernetes/client-node";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { IpcMainInvokeEvent } from "electron";
import {
  ApiClientFactory,
  ConfigMap,
  Deployment,
  Endpoint,
  Event,
  Job,
  KubeClient,
  KubeConfigManager,
  Namespace,
  Pod,
  PortForwardManager,
  ReplicaSet,
  Service,
  ServiceAccount,
} from "./backend";
import { IpcActions } from "./shared/ipc-actions";
import { Secret } from "./backend/secret";

const kubeConfig = new k8s.KubeConfig();
kubeConfig.loadFromDefault();
const apiClientFactory = new ApiClientFactory(kubeConfig);
const kubeConfigManager = new KubeConfigManager(kubeConfig);
export const portForwardManager = new PortForwardManager(kubeConfig);
const kubeClient = new KubeClient(
  kubeConfig,
  kubeConfigManager,
  apiClientFactory,
);
export const pod = new Pod(kubeClient);
const configMap = new ConfigMap(apiClientFactory);
const deployment = new Deployment(apiClientFactory);
const endpoint = new Endpoint(apiClientFactory);
const event = new Event(apiClientFactory);
const job = new Job(apiClientFactory);
const namespace = new Namespace(apiClientFactory);
const replicaSet = new ReplicaSet(apiClientFactory);
const service = new Service(apiClientFactory);
const serviceAccount = new ServiceAccount(apiClientFactory);
const secret = new Secret(apiClientFactory);

type Listiner = (
  event: IpcMainInvokeEvent,
  ...args: any[]
) => Promise<any> | any;

export const ipcControllers: Record<string, Listiner> = {
  [IpcActions.getCurrentContext]: kubeClient.getCurrentContext,

  [IpcActions.listContexts]: kubeClient.listContexts,

  [IpcActions.switchContext]: (e, name: string) =>
    kubeClient.switchContext(name),

  [IpcActions.listNamespaces]: namespace.listNamespaces,

  [IpcActions.listDeployments]: (e, namespace: string) =>
    deployment.listDeployments(namespace),

  [IpcActions.getDeployment]: (e, namespace: string, name: string) =>
    deployment.getDeployment({ namespace, name }),

  [IpcActions.rescaleDeployment]: (
    e,
    namespace: string,
    name: string,
    replicas: number,
  ) => deployment.rescaleDeployment({ namespace, name, replicas }),

  [IpcActions.listReplicaSets]: (e, namespace: string) =>
    replicaSet.listReplicaSets(namespace),

  [IpcActions.getReplicaSet]: (e, namespace: string, name: string) =>
    replicaSet.getReplicaSet({ namespace, name }),

  [IpcActions.listEvents]: (e, namespace: string, name: string) =>
    event.listEvents({ namespace, name }),

  [IpcActions.getPodOwner]: (e, namespace: string, name: string) =>
    pod.getPodOwner({ namespace, name }),

  [IpcActions.deletePod]: (e, namespace: string, name: string) =>
    pod.deletePod({ namespace, name }),

  [IpcActions.listDeploymentPods]: (e, namespace: string, name: string) =>
    deployment.listDeploymentPods({ namespace, name }),

  [IpcActions.listPods]: (e, namespace: string) => pod.listPods(namespace),

  [IpcActions.getPod]: (e, namespace: string, name: string) =>
    pod.getPod({ namespace, name }),

  [IpcActions.getPodLogs]: (
    e,
    namespace: string,
    name: string,
    container: string,
  ) => pod.logs({ namespace, name, container }),

  [IpcActions.portForward]: (
    e,
    namespace: string,
    name: string,
    targetPort: number,
    userPort: number,
  ) =>
    portForwardManager.portForward({ namespace, name, targetPort, userPort }),
  [IpcActions.closePortForward]: (
    e,
    namespace: string,
    name: string,
    targetPort: number,
    userPort: number,
  ) =>
    portForwardManager.closePortForward({
      namespace,
      name,
      targetPort,
      userPort,
    }),

  [IpcActions.listForwardedPortServers]: portForwardManager.listPortForwards,

  [IpcActions.closeAllPortForwards]: portForwardManager.closeAllPortForwards,

  [IpcActions.listServiceAccounts]: (e, namespace: string) =>
    serviceAccount.listServiceAccounts({ namespace }),

  [IpcActions.getServiceAccount]: (e, namespace: string, name: string) =>
    serviceAccount.getServiceAccount({ namespace, name }),

  [IpcActions.listSecrets]: (e, namespace: string) =>
    secret.listSecrets({ namespace }),

  [IpcActions.getSecret]: (e, namespace: string, name: string) =>
    secret.getSecret({ namespace, name }),

  [IpcActions.listConfigMaps]: (e, namespace: string) =>
    configMap.listConfigMaps(namespace),

  [IpcActions.getConfigMap]: (e, namespace: string, name: string) =>
    configMap.getConfigMap({ namespace, name }),

  [IpcActions.listServices]: (e, namespace: string) =>
    service.listServices({ namespace }),
  [IpcActions.getService]: (e, namespace: string, name: string) =>
    service.getService({ namespace, name }),

  [IpcActions.getServiceStatus]: (e, namespace: string, name: string) =>
    service.getServiceStatus({ namespace, name }),

  [IpcActions.queryPodsBySelector]: (
    e,
    namespace: string,
    labels: Record<string, string>,
  ) => pod.queryPodsBySelector({ namespace, labels }),

  [IpcActions.listEndpoints]: (
    e,
    namespace: string,
    labels: Record<string, string>,
  ) => endpoint.listEndpoints({ namespace, labels }),

  [IpcActions.queryJobsBySelector]: (
    e,
    namespace: string,
    labels: Record<string, string>,
  ) => job.queryJobsBySelector({ namespace, labels }),

  [IpcActions.listJobs]: (e, namespace: string) => job.listJobs({ namespace }),

  [IpcActions.getJob]: (e, namespace: string, name: string) =>
    job.getJob({ namespace, name }),

  [IpcActions.listCronJobs]: (e, namespace: string) =>
    job.listCronJobs({ namespace }),

  [IpcActions.getCronJob]: (e, namespace: string, name: string) =>
    job.getCronJob({ namespace, name }),
};

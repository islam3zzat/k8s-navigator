import { Context, V1CronJobList } from "@kubernetes/client-node";

interface K8sNavigator {
  // Contexts
  listContexts: () => Promise<Context[]>;
  switchContext: (name: string) => Promise<Context>;
  getCurrentContext: () => Promise<Context>;

  // CronJobs
  listCronJobs: (namespace: string) => Promise<V1CronJobList>;

  // Deployments
  listDeployments: (namespace: string) => Promise<V1DeploymentList>;

  getDeployment: (namespace: string, name: string) => Promise<V1Deployment>;

  rescaleDeployment: (
    namespace: string,
    name: string,
    replicas: number,
  ) => Promise<V1Deployment>;

  updateEnviormentVariables: (
    namespace: string,
    name: string,
    containerName: string,
    env: Record<string, string>,
  ) => Promise<V1Deployment>;

  updateDeployment: (
    namespace: string,
    name: string,
    deployment: V1Deployment,
  ) => Promise<V1Deployment>;

  // Endpoints
  listEndpoints: (
    namespace: string,
    selector: Record<string, string>,
  ) => Promise<V1EndpointsList>;

  // Events
  listEvents: (namespace: string, name?: string) => Promise<V1EventList>;

  // Pods
  listForwardedPortServers: () => Array<{
    namespace: string;
    name: string;
    userPort: string;
    targetPort: string;
  }>;

  getPod: (namespace: string, name: string) => Promise<V1Pod>;

  getPodOwner: (namespace: string, name: string) => Promise<V1OwnerReference>;

  deletePod: (namespace: string, name: string) => Promise<V1Pod>;

  portForward: (
    namespace: string,
    name: string,
    targetPort: string,
    userPort: string,
  ) => void;

  closePortForward: (
    namespace: string,
    name: string,
    targetPort: string,
    userPort: string,
  ) => Promise<void>;

  closeAllPortForwards: () => Promise<void>;

  queryPodsBySelector: (
    namespace: string,
    selector: Record<string, string>,
  ) => Promise<V1PodList>;

  listDeploymentPods: (
    namespace: string,
    deploymentName: string,
  ) => Promise<V1PodList>;

  listPods: (namespace: string) => Promise<V1PodList>;

  // Jobs
  queryJobsBySelector: (
    namespace: string,
    selector: Record<string, string>,
  ) => Promise<V1JobList>;

  listJobs: (namespace: string) => Promise<V1JobList>;

  getJob: (namespace: string, name: string) => Promise<V1Job>;

  // Cron Jobs
  listCronJobs: (namespace: string) => Promise<V1CronJobList>;

  getCronJob: (namespace: string, name: string) => Promise<V1CronJob>;

  // Namespaces
  listNamespaces: () => Promise<V1NamespaceList>;

  // ReplicaSets
  listReplicaSets: (namespace: string) => Promise<V1ReplicaSetList>;

  getReplicaSet: (namespace: string, name: string) => Promise<V1ReplicaSet>;

  // Secrets
  listSecrets: (namespace: string) => Promise<V1SecretList>;

  getSecret: (namespace: string, name: string) => Promise<V1Secret>;

  // ConfigMaps
  listConfigMaps: (namespace: string) => Promise<V1ConfigMapList>;

  getConfigMap: (namespace: string, name: string) => Promise<V1ConfigMap>;

  // Service accounts
  listServiceAccounts: (namespace: string) => Promise<V1ServiceAccountList>;

  getServiceAccount: (
    namespace: string,
    name: string,
  ) => Promise<V1ServiceAccount>;

  // Services
  listServices: (namespace: string) => Promise<V1ServiceList>;

  getService: (namespace: string, name: string) => Promise<V1Service>;
}

interface logs {
  // events
  onLogEnd: (callback: () => void) => void;

  onLogError: (callback: (err: Error) => void) => void;

  onLogData: (callback: (data: string) => void) => void;

  tailPodLogs: (
    namespace: string,
    podName: string,
    containerName: string,
    follow: boolean,
  ) => void;

  stopLogStream: (
    namespace: string,
    podName: string,
    containerName: string,
  ) => void;
}

interface electron {
  findInPage: (text: string) => void;
  stopFindInPage: () => void;
  findNext: (text: string) => void;
  findPrevious: (text: string) => void;
}

interface commandRunner {
  runCommand: (command: string) => void;
  onCommandOutput: (callback: (data: string) => void) => void;
  onCommandEnd: (callback: () => void) => void;
  onCommandError: (callback: (error: string) => void) => void;
  removeAllListeners: () => void;
}

declare global {
  interface Window {
    k8sNavigator: K8sNavigator;
    electron: electron;
    logs: logs;
    commandRunner: commandRunner;
  }

  interface globalThis {
    k8sNavigator: K8sNavigator;
    electron: electron;
    logs: logs;
    commandRunner: commandRunner;
  }
}

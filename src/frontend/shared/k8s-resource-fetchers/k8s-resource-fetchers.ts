type ResourceFetcher<T> = (namespace: string, name: string) => Promise<T>;

const resourceFetchers = {
  configMap: window.k8sNavigator.getConfigMap,
  cronJob: window.k8sNavigator.getCronJob,
  deployment: window.k8sNavigator.getDeployment,
  job: window.k8sNavigator.getJob,
  pod: window.k8sNavigator.getPod,
  replicaSet: window.k8sNavigator.getReplicaSet,
  secret: window.k8sNavigator.getSecret,
  service: window.k8sNavigator.getService,
  serviceAccount: window.k8sNavigator.getServiceAccount,
};

export type ResourceFetcherKey = keyof typeof resourceFetchers;

export const getResourceFetcher = <T>(
  key: ResourceFetcherKey,
): ResourceFetcher<T> => {
  return resourceFetchers[key] as ResourceFetcher<T>;
};

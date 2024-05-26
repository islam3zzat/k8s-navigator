import { Event } from "./events";
import { ApiVersion, IApiClientFactory } from "./kube-client/ApiClientFactory";
import { NamespacedName } from "./types";

export class Deployment {
  constructor(private apiClientFactory: IApiClientFactory) {}

  listDeployments = async (namespace: string) => {
    const appsV1Api = this.apiClientFactory.getApiClient(ApiVersion.AppsV1);

    const response = await appsV1Api.listNamespacedDeployment(namespace);

    return response.body;
  };

  getDeployment = async ({ namespace, name }: NamespacedName) => {
    const appsV1Api = this.apiClientFactory.getApiClient(ApiVersion.AppsV1);

    const response = await appsV1Api.readNamespacedDeployment(name, namespace);

    return response.body;
  };

  rescaleDeployment = async ({
    namespace,
    name,
    replicas,
  }: NamespacedName & { replicas: number }) => {
    const deployment = await this.getDeployment({ namespace, name });

    if (!deployment?.spec) {
      throw new Error("Deployment spec not found");
    }

    deployment.spec.replicas = replicas;

    const appsV1Api = this.apiClientFactory.getApiClient(ApiVersion.AppsV1);

    const response = await appsV1Api.replaceNamespacedDeployment(
      name,
      namespace,
      deployment,
    );

    return response.body;
  };

  updateEnviormentVariables = async ({
    namespace,
    name,
    containerName,
    env,
  }: NamespacedName & {
    containerName: string;
    env: Record<string, string>;
  }) => {
    const deployment = await this.getDeployment({ namespace, name });

    if (!deployment?.spec) {
      throw new Error("Deployment spec not found");
    }
    const container = deployment.spec.template.spec.containers.find(
      (container) => container.name === containerName,
    );

    if (!container) {
      throw new Error("Container not found");
    }

    deployment.spec.template.spec.containers.forEach((container) => {
      if (container.name !== containerName) {
        return;
      }

      container.env = Object.entries(env).map(([name, value]) => ({
        name,
        value,
      }));
    });

    const appsV1Api = this.apiClientFactory.getApiClient(ApiVersion.AppsV1);

    const response = await appsV1Api.replaceNamespacedDeployment(
      name,
      namespace,
      deployment,
    );

    return response.body;
  };

  listEvents = async ({ namespace, name }: NamespacedName) => {
    const events = new Event(this.apiClientFactory);
    return events.listEvents({ namespace, name });
  };

  listDeploymentPods = async ({ namespace, name }: NamespacedName) => {
    const deployment = await this.getDeployment({ namespace, name });

    const labels = deployment.spec?.selector.matchLabels || {};
    const labelSelector = Object.entries(labels).reduce(
      (acc, [key, value]) => `${acc}${key}=${value},`,
      "",
    );

    const coreV1Api = this.apiClientFactory.getApiClient(ApiVersion.CoreV1);

    const response = await coreV1Api.listNamespacedPod(
      namespace,
      undefined,
      undefined,
      undefined,
      undefined,
      labelSelector.slice(0, -1),
    );

    return response.body;
  };
}

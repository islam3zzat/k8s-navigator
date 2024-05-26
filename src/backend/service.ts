import { ApiVersion, IApiClientFactory } from "./kube-client/ApiClientFactory";
import { NamespacedName } from "./types";

export class Service {
  constructor(private apiClientFactory: IApiClientFactory) {}

  listServices = async ({ namespace }: { namespace: string }) => {
    const coreV1Api = this.apiClientFactory.getApiClient(ApiVersion.CoreV1);

    const response = await coreV1Api.listNamespacedService(namespace);

    return response.body;
  };

  getService = async ({ namespace, name }: NamespacedName) => {
    const coreV1Api = this.apiClientFactory.getApiClient(ApiVersion.CoreV1);

    const response = await coreV1Api.readNamespacedService(name, namespace);

    return response.body;
  };

  getServiceStatus = async ({ namespace, name }: NamespacedName) => {
    const coreV1Api = this.apiClientFactory.getApiClient(ApiVersion.CoreV1);

    const response = await coreV1Api.readNamespacedServiceStatus(
      name,
      namespace,
    );

    return response.body;
  };

  listEndpoints = async ({ namespace, name }: NamespacedName) => {
    const coreV1Api = this.apiClientFactory.getApiClient(ApiVersion.CoreV1);

    const response = await coreV1Api.listNamespacedEndpoints(
      namespace,
      undefined,
      undefined,
      undefined,
      undefined,
      `metadata.name=${name}`,
    );

    return response.body;
  };
}

import { ApiVersion, IApiClientFactory } from "./kube-client/ApiClientFactory";
import { NamespacedName } from "./types";

export class ConfigMap {
  constructor(private apiClientFactory: IApiClientFactory) {}

  listConfigMaps = async (namespace: string) => {
    const coreV1Api = this.apiClientFactory.getApiClient(ApiVersion.CoreV1);
    const response = await coreV1Api.listNamespacedConfigMap(namespace);
    return response.body;
  };

  getConfigMap = async ({ namespace, name }: NamespacedName) => {
    const coreV1Api = this.apiClientFactory.getApiClient(ApiVersion.CoreV1);
    const response = await coreV1Api.readNamespacedConfigMap(name, namespace);
    return response.body;
  };
}

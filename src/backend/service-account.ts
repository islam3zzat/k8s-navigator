import { ApiVersion, IApiClientFactory } from "./kube-client/ApiClientFactory";
import { NamespacedName } from "./types";

export class ServiceAccount {
  constructor(private apiClientFactory: IApiClientFactory) {}

  listServiceAccounts = async ({ namespace }: { namespace: string }) => {
    const coreV1Api = this.apiClientFactory.getApiClient(ApiVersion.CoreV1);

    const response = await coreV1Api.listNamespacedServiceAccount(namespace);

    return response.body;
  };

  getServiceAccount = async ({ namespace, name }: NamespacedName) => {
    const coreV1Api = this.apiClientFactory.getApiClient(ApiVersion.CoreV1);

    const response = await coreV1Api.readNamespacedServiceAccount(
      name,
      namespace,
    );

    return response.body;
  };
}

import { ApiVersion, IApiClientFactory } from "./kube-client/ApiClientFactory";
import { NamespacedName } from "./types";

export class Secret {
  constructor(private apiClientFactory: IApiClientFactory) {}
  listSecrets = async ({ namespace }: { namespace: string }) => {
    const coreV1Api = this.apiClientFactory.getApiClient(ApiVersion.CoreV1);

    const response = await coreV1Api.listNamespacedSecret(namespace);

    return response.body;
  };

  getSecret = async ({ namespace, name }: NamespacedName) => {
    const coreV1Api = this.apiClientFactory.getApiClient(ApiVersion.CoreV1);

    const response = await coreV1Api.readNamespacedSecret(name, namespace);

    return response.body;
  };
}

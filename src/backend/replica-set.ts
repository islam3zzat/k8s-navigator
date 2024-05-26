import { ApiVersion, IApiClientFactory } from "./kube-client/ApiClientFactory";
import { NamespacedName } from "./types";

export class ReplicaSet {
  constructor(private apiClientFactory: IApiClientFactory) {}

  listReplicaSets = async (namespace: string) => {
    const appsV1Api = this.apiClientFactory.getApiClient(ApiVersion.AppsV1);
    const response = await appsV1Api.listNamespacedReplicaSet(namespace);
    return response.body;
  };

  getReplicaSet = async ({ namespace, name }: NamespacedName) => {
    const appsV1Api = this.apiClientFactory.getApiClient(ApiVersion.AppsV1);
    const response = await appsV1Api.readNamespacedReplicaSet(name, namespace);
    return response.body;
  };
}

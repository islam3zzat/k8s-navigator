import { ApiVersion, IApiClientFactory } from "./kube-client/ApiClientFactory";

export class Namespace {
  constructor(private apiClientFactory: IApiClientFactory) {}

  public listNamespaces = async () => {
    const coreV1Api = this.apiClientFactory.getApiClient(ApiVersion.CoreV1);
    const response = await coreV1Api.listNamespace();
    return response.body;
  };

  public getCurrentNamespace = () => {
    const kubernetesObjectApi = this.apiClientFactory.getApiClient(
      ApiVersion.KubernetesObject,
    );

    return kubernetesObjectApi;
  };
}

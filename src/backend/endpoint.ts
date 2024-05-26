import { ApiVersion, IApiClientFactory } from "./kube-client/ApiClientFactory";

export class Endpoint {
  constructor(private apiClientFactory: IApiClientFactory) {}

  listEndpoints = async ({
    namespace,
    labels,
  }: {
    namespace: string;
    labels: Record<string, string>;
  }) => {
    const selector = Object.entries(labels)
      .reduce((acc, [key, value]) => `${acc}${key}=${value},`, "")
      .slice(0, -1);

    const coreV1Api = this.apiClientFactory.getApiClient(ApiVersion.CoreV1);
    const response = await coreV1Api.listNamespacedEndpoints(
      namespace,
      undefined,
      undefined,
      undefined,
      undefined,
      selector,
    );

    return response.body;
  };
}

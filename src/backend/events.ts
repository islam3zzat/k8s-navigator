import { ApiVersion, IApiClientFactory } from "./kube-client/ApiClientFactory";
import { NamespacedName } from "./types";

export class Event {
  constructor(private apiClientFactory: IApiClientFactory) {}

  listEvents = async ({ namespace, name }: NamespacedName) => {
    const coreV1Api = this.apiClientFactory.getApiClient(ApiVersion.CoreV1);
    const response = await coreV1Api.listNamespacedEvent(
      namespace,
      undefined,
      undefined,
      undefined,
      `involvedObject.name=${name}`,
    );

    return response.body;
  };
}

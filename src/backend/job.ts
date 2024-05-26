import { ApiVersion, IApiClientFactory } from "./kube-client/ApiClientFactory";
import { NamespacedName } from "./types";

export class Job {
  constructor(private apiClientFactory: IApiClientFactory) {}

  listJobs = async ({ namespace }: { namespace: string }) => {
    const batchV1Api = this.apiClientFactory.getApiClient(ApiVersion.BatchV1);
    const response = await batchV1Api.listNamespacedJob(namespace);
    return response.body;
  };

  queryJobsBySelector = async ({
    namespace,
    labels = {},
  }: {
    namespace: string;
    labels: Record<string, string>;
  }) => {
    const batchV1Api = this.apiClientFactory.getApiClient(ApiVersion.BatchV1);
    const selector = Object.entries(labels)
      .reduce((acc, [key, value]) => `${acc}${key}=${value},`, "")
      .slice(0, -1);
    const jobs = await batchV1Api.listNamespacedJob(
      namespace,
      undefined,
      undefined,
      undefined,
      undefined,
      selector || undefined,
    );
    return jobs.body;
  };

  getJob = async ({ namespace, name }: NamespacedName) => {
    const batchV1Api = this.apiClientFactory.getApiClient(ApiVersion.BatchV1);

    const response = await batchV1Api.readNamespacedJob(name, namespace);
    return response.body;
  };

  listCronJobs = async ({ namespace }: { namespace: string }) => {
    const batchV1Api = this.apiClientFactory.getApiClient(ApiVersion.BatchV1);

    const response = await batchV1Api.listNamespacedCronJob(namespace);

    return response.body;
  };

  getCronJob = async ({ namespace, name }: NamespacedName) => {
    const batchV1Api = this.apiClientFactory.getApiClient(ApiVersion.BatchV1);

    const response = await batchV1Api.readNamespacedCronJob(name, namespace);

    return response.body;
  };
}

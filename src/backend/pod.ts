import stream from "stream";
import { ApiVersion } from "./kube-client/ApiClientFactory";
import { KubeClient } from "./kube-client/KubeClient";
import { NamespacedName } from "./types";

export class Pod {
  constructor(private kubeClient: KubeClient) {}

  async listPods(namespace: string) {
    const coreV1Api = this.kubeClient.getApiClient(ApiVersion.CoreV1);

    const response = await coreV1Api.listNamespacedPod(namespace);

    return response.body;
  }

  async getPod({ namespace, name }: NamespacedName) {
    const coreV1Api = this.kubeClient.getApiClient(ApiVersion.CoreV1);
    const response = await coreV1Api.readNamespacedPod(name, namespace);

    return response.body;
  }

  async deletePod({ namespace, name }: NamespacedName) {
    const coreV1Api = this.kubeClient.getApiClient(ApiVersion.CoreV1);
    const response = await coreV1Api.deleteNamespacedPod(name, namespace);

    return response.body;
  }

  async getPodOwner({ namespace, name }: NamespacedName) {
    const pod = await this.getPod({ namespace, name });

    if (pod.metadata.ownerReferences.length === 0) {
      return {};
    }

    return pod.metadata.ownerReferences.reduce(
      (acc, ref) => {
        acc[ref.kind] = ref.name;
        return acc;
      },
      {} as Record<string, unknown>,
    );
  }

  async logs({
    namespace,
    name,
    container,
  }: NamespacedName & { container?: string }) {
    const coreV1Api = this.kubeClient.getApiClient(ApiVersion.CoreV1);

    const response = await coreV1Api.readNamespacedPodLog(
      name,
      namespace,
      container,
    );

    return response.body;
  }

  async queryPodsBySelector({
    namespace,
    labels = {},
  }: {
    namespace: string;
    labels: Record<string, string>;
  }) {
    const coreV1Api = this.kubeClient.getApiClient(ApiVersion.CoreV1);

    const selector = Object.entries(labels).reduce(
      (acc, [key, value]) => `${acc}${key}=${value},`,
      "",
    );
    const response = await coreV1Api.listNamespacedPod(
      namespace,
      undefined,
      undefined,
      undefined,
      undefined,
      selector.slice(0, -1) || undefined,
    );

    return response.body;
  }

  async tailLogs({
    namespace,
    name,
    container,
    follow,
  }: NamespacedName & {
    container?: string;
    follow?: boolean;
  }) {
    // Create the necessary API and log stream objects
    const k8sLog = await this.kubeClient.log();

    const logStream = new stream.PassThrough({ objectMode: true });

    k8sLog
      .log(namespace, name, container, logStream, {
        follow: follow,
        pretty: true,
      })
      .catch((err) => {
        console.error("Error getting logs:", err);
      });

    return logStream;
  }
}

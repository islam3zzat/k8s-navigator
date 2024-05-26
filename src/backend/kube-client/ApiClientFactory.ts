import * as k8s from "@kubernetes/client-node";

export type SupportedApiVersions = {
  CoreV1: k8s.CoreV1Api;
  BatchV1: k8s.BatchV1Api;
  KubernetesObject: k8s.KubernetesObjectApi;
  AppsV1: k8s.AppsV1Api;
};

export interface IApiClientFactory {
  getApiClient<T extends keyof SupportedApiVersions>(
    apiVersion: T,
  ): SupportedApiVersions[T];
}

export enum ApiVersion {
  CoreV1 = "CoreV1",
  BatchV1 = "BatchV1",
  KubernetesObject = "KubernetesObject",
  AppsV1 = "AppsV1",
}

export class ApiClientFactory implements IApiClientFactory {
  constructor(private kubeConfig: k8s.KubeConfig) {}

  public getApiClient<T extends keyof SupportedApiVersions>(
    apiVersion: T,
  ): SupportedApiVersions[T] {
    switch (apiVersion) {
      case ApiVersion.CoreV1:
        return this.kubeConfig.makeApiClient(
          k8s.CoreV1Api,
        ) as SupportedApiVersions[T];
      case ApiVersion.BatchV1:
        return this.kubeConfig.makeApiClient(
          k8s.BatchV1Api,
        ) as SupportedApiVersions[T];
      case ApiVersion.KubernetesObject:
        return this.kubeConfig.makeApiClient(
          k8s.KubernetesObjectApi,
        ) as SupportedApiVersions[T];
      case ApiVersion.AppsV1:
        return this.kubeConfig.makeApiClient(
          k8s.AppsV1Api,
        ) as SupportedApiVersions[T];
      default:
        throw new Error(`Unsupported API version: ${apiVersion}`);
    }
  }
}

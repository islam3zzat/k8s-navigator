import * as k8s from "@kubernetes/client-node";
import { KubeConfigManager } from "./KubeConfigManager";
import { ApiClientFactory, SupportedApiVersions } from "./ApiClientFactory";

export class KubeClient {
  constructor(
    private kubeConfig: k8s.KubeConfig,
    private configManager: KubeConfigManager = new KubeConfigManager(
      kubeConfig,
    ),
    private apiClientFactory: ApiClientFactory = new ApiClientFactory(
      kubeConfig,
    ),
  ) {}

  public getApiClient = <T extends keyof SupportedApiVersions>(
    apiVersion: T,
  ) => {
    return this.apiClientFactory.getApiClient<T>(
      apiVersion,
    ) as SupportedApiVersions[T];
  };

  public listContexts = () => {
    return this.configManager.contexts;
  };

  public switchContext = async (name: string) => {
    await this.configManager.setCurrentContext(name);

    return this.configManager.getCurrentContext();
  };

  public getCurrentContext = () => {
    return this.configManager.getCurrentContext();
  };

  public log = () => {
    return new k8s.Log(this.kubeConfig);
  };
}

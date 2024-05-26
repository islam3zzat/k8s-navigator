import * as k8s from "@kubernetes/client-node";

export interface IKubeConfig {
  loadFromDefault(): void;
  makeApiClient<T extends k8s.ApiType>(apiClient: new () => T): T;
  contexts: k8s.Context[];
  setCurrentContext(context: string): void;
  getCurrentContext(): Promise<k8s.Context>;
  getContextObject(context: string): k8s.Context;
}

export class KubeConfigManager implements IKubeConfig {
  private kc: k8s.KubeConfig;

  constructor(kc: k8s.KubeConfig) {
    this.kc = kc;
  }

  loadFromDefault = () => {
    this.kc.loadFromDefault();
  };

  makeApiClient = <T extends k8s.ApiType>(apiClient: new () => T): T => {
    return this.kc.makeApiClient(apiClient);
  };

  get contexts() {
    return this.kc.contexts;
  }

  setCurrentContext = (context: string) => {
    this.kc.setCurrentContext(context);
  };

  getCurrentContext = async () => {
    return await this.getContextObject(this.kc.getCurrentContext());
  };

  getContextObject = (context: string) => {
    return this.kc.getContextObject(context);
  };
}

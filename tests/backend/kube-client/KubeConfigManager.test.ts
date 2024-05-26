import * as k8s from "@kubernetes/client-node";
import { KubeConfigManager } from "../../../src/backend/kube-client";

jest.mock("@kubernetes/client-node");

describe("KubeConfigManager", () => {
  let kubeConfig: jest.Mocked<k8s.KubeConfig>;
  let kubeConfigManager: KubeConfigManager;

  beforeEach(() => {
    kubeConfig = new k8s.KubeConfig() as jest.Mocked<k8s.KubeConfig>;
    kubeConfigManager = new KubeConfigManager(kubeConfig);
  });

  it("should load from default configuration", () => {
    kubeConfigManager.loadFromDefault();
    expect(kubeConfig.loadFromDefault).toHaveBeenCalled();
  });

  it("should make API client", () => {
    const apiClient = new k8s.CoreV1Api();
    kubeConfig.makeApiClient.mockReturnValue(apiClient);

    const client = kubeConfigManager.makeApiClient(k8s.CoreV1Api);
    expect(kubeConfig.makeApiClient).toHaveBeenCalledWith(k8s.CoreV1Api);
    expect(client).toBe(apiClient);
  });

  it("should return contexts", () => {
    const contexts = [{ name: "context1" }] as k8s.Context[];
    kubeConfig.contexts = contexts;

    expect(kubeConfigManager.contexts).toBe(contexts);
  });

  it("should set the current context", () => {
    kubeConfigManager.setCurrentContext("context1");
    expect(kubeConfig.setCurrentContext).toHaveBeenCalledWith("context1");
  });

  it("should get the current context name", () => {
    kubeConfig.getCurrentContext.mockReturnValue("context1");

    const context = kubeConfigManager.getCurrentContext();
    expect(kubeConfig.getCurrentContext).toHaveBeenCalled();
    expect(context).toBe("context1");
  });

  it("should get the context object", () => {
    const contextObject = { name: "context1" } as k8s.Context;
    kubeConfig.getContextObject.mockReturnValue(contextObject);

    const context = kubeConfigManager.getContextObject("context1");
    expect(kubeConfig.getContextObject).toHaveBeenCalledWith("context1");
    expect(context).toBe(contextObject);
  });
});

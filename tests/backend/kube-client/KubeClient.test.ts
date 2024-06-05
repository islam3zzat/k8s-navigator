import * as k8s from "@kubernetes/client-node";
import {
  ApiClientFactory,
  KubeClient,
  KubeConfigManager,
} from "~/backend/kube-client";
import { DeepWritable } from "./types-helper";

jest.mock("~/backend/kube-client/KubeConfigManager");
jest.mock("~/backend/kube-client/PortForwardManager");
jest.mock("~/backend/kube-client/ApiClientFactory");

describe("KubeClient", () => {
  let kubeConfig: k8s.KubeConfig;
  let kubeConfigManager: jest.Mocked<KubeConfigManager>;
  let apiClientFactory: jest.Mocked<ApiClientFactory>;
  let kubeClient: KubeClient;

  beforeEach(() => {
    kubeConfig = new k8s.KubeConfig();
    kubeConfigManager = new KubeConfigManager(
      kubeConfig,
    ) as jest.Mocked<KubeConfigManager>;

    // Mocking necessary methods
    kubeConfigManager.setCurrentContext = jest.fn();
    kubeConfigManager.getCurrentContext = jest.fn();
    kubeConfigManager.getContextObject = jest.fn();
    (kubeConfigManager as DeepWritable<KubeConfigManager>).contexts = [];

    apiClientFactory = new ApiClientFactory(
      kubeConfig,
    ) as jest.Mocked<ApiClientFactory>;
    kubeClient = new KubeClient(
      kubeConfig,
      kubeConfigManager,
      apiClientFactory,
    );
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should list contexts", () => {
    const contexts = [{ name: "context1" }, { name: "context2" }];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (kubeConfigManager as any).contexts = contexts;

    expect(kubeClient.listContexts()).toBe(contexts);
  });

  it("should switch context", async () => {
    await kubeClient.switchContext("context1");

    expect(kubeConfigManager.setCurrentContext).toHaveBeenCalledWith(
      "context1",
    );
    expect(kubeConfigManager.getCurrentContext).toHaveBeenCalled();
  });

  it("should delegate getCurrentContext to configManager", async () => {
    await kubeClient.getCurrentContext();

    expect(kubeConfigManager.getCurrentContext).toHaveBeenCalled();
  });

  it("should return log instance", () => {
    const log = kubeClient.log();

    expect(log).toBeInstanceOf(k8s.Log);
  });
});

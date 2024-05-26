import * as k8s from "@kubernetes/client-node";
import {
  ApiClientFactory,
  KubeClient,
  KubeConfigManager,
} from "../../../src/backend/kube-client";

jest.mock("../../../src/backend/kube-client/KubeConfigManager");
jest.mock("../../../src/backend/kube-client/PortForwardManager");
jest.mock("../../../src/backend/kube-client/ApiClientFactory");

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
    apiClientFactory = new ApiClientFactory(
      kubeConfig,
    ) as jest.Mocked<ApiClientFactory>;
    kubeClient = new KubeClient(
      kubeConfig,
      kubeConfigManager,
      apiClientFactory,
    );
  });

  it("should list contexts", () => {
    const contexts = [{ name: "context1" }, { name: "context2" }];
    // @ts-expect-error testing
    kubeConfigManager.contexts = contexts;

    expect(kubeClient.listContexts()).toBe(contexts);
  });

  it("should switch context", async () => {
    kubeConfigManager.setCurrentContext.mockImplementation(() => {
      // test
    });
    kubeConfigManager.getCurrentContext.mockReturnValue("context1");

    await kubeClient.switchContext("context1");

    expect(kubeConfigManager.setCurrentContext).toHaveBeenCalledWith(
      "context1",
    );
    expect(kubeConfigManager.getCurrentContext).toHaveBeenCalled();
  });

  it("should get current context", async () => {
    const currentContextName = "context1";
    const currentContextObject = {
      name: "context1",
      cluster: "cluster1",
      user: "user1",
    };

    kubeConfigManager.getCurrentContext.mockReturnValue(currentContextName);
    kubeConfigManager.getContextObject.mockReturnValue(currentContextObject);

    const context = kubeClient.getCurrentContext();

    expect(kubeConfigManager.getCurrentContext).toHaveBeenCalled();
    expect(kubeConfigManager.getContextObject).toHaveBeenCalledWith(
      currentContextName,
    );
    expect(context).toEqual(currentContextObject);
  });

  it("should return log instance", () => {
    const log = kubeClient.log();

    expect(log).toBeInstanceOf(k8s.Log);
  });
});

import * as k8s from "@kubernetes/client-node";
import { DeepWritable } from "./types-helper";
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
    kubeConfig.loadFromString(`
apiVersion: v1
clusters:
- cluster:
    server: https://localhost:6443
  name: kubernetes
contexts:
- context:
    cluster: kubernetes
    user: kubernetes-admin
  name: kubernetes-admin@kubernetes
current-context: kubernetes-admin@kubernetes
kind: Config
preferences: {}
users:
- name: kubernetes-admin
  user:
    client-certificate-data: REDACTED
    client-key-data: REDACTED
`);
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

  it.skip("should get current context", async () => {
    const currentContextName = "context1";
    const currentContextObject = {
      name: "context1",
      cluster: "cluster1",
      user: "user1",
    };

    kubeConfigManager.getCurrentContext.mockReturnValue(
      Promise.resolve({ name: currentContextName } as k8s.Context),
    );
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

/* eslint-disable @typescript-eslint/no-explicit-any */
import * as k8s from "@kubernetes/client-node";
import { Deployment } from "~/backend/deployment";
import {
  ApiVersion,
  IApiClientFactory,
} from "~/backend/kube-client/ApiClientFactory";

jest.mock("~/backend/kube-client/ApiClientFactory");
jest.mock("~/backend/events");

describe("Deployment", () => {
  let apiClientFactory: jest.Mocked<IApiClientFactory>;
  let appsV1Api: jest.Mocked<k8s.AppsV1Api>;
  let coreV1Api: jest.Mocked<k8s.CoreV1Api>;
  let deployment: Deployment;

  // Mock console methods
  beforeAll(() => {
    jest.spyOn(console, "warn").mockImplementation(() => {
      //
    });
    jest.spyOn(console, "error").mockImplementation(() => {
      //
    });
  });

  // Restore console methods
  afterAll(() => {
    (console.warn as jest.Mock).mockRestore();
    (console.error as jest.Mock).mockRestore();
  });

  beforeEach(() => {
    appsV1Api = {
      listNamespacedDeployment: jest.fn(),
      readNamespacedDeployment: jest.fn(),
      replaceNamespacedDeployment: jest.fn(),
    } as unknown as jest.Mocked<k8s.AppsV1Api>;

    coreV1Api = {
      listNamespacedPod: jest.fn(),
    } as unknown as jest.Mocked<k8s.CoreV1Api>;

    apiClientFactory = {
      getApiClient: jest.fn().mockImplementation((version: ApiVersion) => {
        if (version === ApiVersion.AppsV1) return appsV1Api;
        if (version === ApiVersion.CoreV1) return coreV1Api;
      }),
    } as unknown as jest.Mocked<IApiClientFactory>;

    deployment = new Deployment(apiClientFactory);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("listDeployments", () => {
    it("should list deployments in the given namespace", async () => {
      const namespace = "default";
      const mockResponse = { body: { items: ["deployment1", "deployment2"] } };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      appsV1Api.listNamespacedDeployment.mockResolvedValue(mockResponse as any);

      const result = await deployment.listDeployments(namespace);

      expect(apiClientFactory.getApiClient).toHaveBeenCalledWith(
        ApiVersion.AppsV1,
      );
      expect(appsV1Api.listNamespacedDeployment).toHaveBeenCalledWith(
        namespace,
      );
      expect(result).toEqual(mockResponse.body);
    });

    it("should handle errors when listing deployments", async () => {
      const namespace = "default";
      appsV1Api.listNamespacedDeployment.mockRejectedValue(
        new Error("Failed to list deployments"),
      );

      await expect(deployment.listDeployments(namespace)).rejects.toThrow(
        "Failed to list deployments",
      );
      expect(apiClientFactory.getApiClient).toHaveBeenCalledWith(
        ApiVersion.AppsV1,
      );
      expect(appsV1Api.listNamespacedDeployment).toHaveBeenCalledWith(
        namespace,
      );
    });
  });

  describe("getDeployment", () => {
    it("should get a deployment by name and namespace", async () => {
      const namespacedName = { namespace: "default", name: "my-deployment" };
      const mockResponse = { body: { metadata: { name: "my-deployment" } } };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      appsV1Api.readNamespacedDeployment.mockResolvedValue(mockResponse as any);

      const result = await deployment.getDeployment(namespacedName);

      expect(apiClientFactory.getApiClient).toHaveBeenCalledWith(
        ApiVersion.AppsV1,
      );
      expect(appsV1Api.readNamespacedDeployment).toHaveBeenCalledWith(
        namespacedName.name,
        namespacedName.namespace,
      );
      expect(result).toEqual(mockResponse.body);
    });

    it("should handle errors when getting a deployment", async () => {
      const namespacedName = { namespace: "default", name: "my-deployment" };
      appsV1Api.readNamespacedDeployment.mockRejectedValue(
        new Error("Failed to get deployment"),
      );

      await expect(deployment.getDeployment(namespacedName)).rejects.toThrow(
        "Failed to get deployment",
      );
      expect(apiClientFactory.getApiClient).toHaveBeenCalledWith(
        ApiVersion.AppsV1,
      );
      expect(appsV1Api.readNamespacedDeployment).toHaveBeenCalledWith(
        namespacedName.name,
        namespacedName.namespace,
      );
    });
  });

  describe("rescaleDeployment", () => {
    it("should rescale a deployment", async () => {
      const namespacedName = {
        namespace: "default",
        name: "my-deployment",
        replicas: 3,
      };
      const mockDeployment = { spec: { replicas: 1 } };
      const mockResponse = { body: { spec: { replicas: 3 } } } as any;
      appsV1Api.readNamespacedDeployment.mockResolvedValue({
        body: mockDeployment,
      } as any);
      appsV1Api.replaceNamespacedDeployment.mockResolvedValue(mockResponse);

      const result = await deployment.rescaleDeployment(namespacedName);

      expect(apiClientFactory.getApiClient).toHaveBeenCalledWith(
        ApiVersion.AppsV1,
      );
      expect(appsV1Api.readNamespacedDeployment).toHaveBeenCalledWith(
        namespacedName.name,
        namespacedName.namespace,
      );
      expect(appsV1Api.replaceNamespacedDeployment).toHaveBeenCalledWith(
        namespacedName.name,
        namespacedName.namespace,
        expect.objectContaining({ spec: { replicas: 3 } }),
      );
      expect(result).toEqual(mockResponse.body);
    });

    it("should throw an error if deployment spec is not found", async () => {
      const namespacedName = {
        namespace: "default",
        name: "my-deployment",
        replicas: 3,
      };
      appsV1Api.readNamespacedDeployment.mockResolvedValue({ body: {} } as any);

      await expect(
        deployment.rescaleDeployment(namespacedName),
      ).rejects.toThrow("Deployment spec not found");
      expect(apiClientFactory.getApiClient).toHaveBeenCalledWith(
        ApiVersion.AppsV1,
      );
      expect(appsV1Api.readNamespacedDeployment).toHaveBeenCalledWith(
        namespacedName.name,
        namespacedName.namespace,
      );
    });
  });

  describe("listDeploymentPods", () => {
    it("should list pods for a deployment", async () => {
      const namespacedName = { namespace: "default", name: "my-deployment" };
      const mockDeployment = {
        spec: { selector: { matchLabels: { app: "my-app" } } },
      };
      const mockPods = { items: ["pod1", "pod2"] };
      appsV1Api.readNamespacedDeployment.mockResolvedValue({
        body: mockDeployment,
      });
      coreV1Api.listNamespacedPod.mockResolvedValue({ body: mockPods });

      const result = await deployment.listDeploymentPods(namespacedName);

      expect(appsV1Api.readNamespacedDeployment).toHaveBeenCalledWith(
        namespacedName.name,
        namespacedName.namespace,
      );
      expect(coreV1Api.listNamespacedPod).toHaveBeenCalledWith(
        namespacedName.namespace,
        undefined,
        undefined,
        undefined,
        undefined,
        "app=my-app",
      );
      expect(result).toEqual(mockPods);
    });

    it("should handle errors when listing pods", async () => {
      const namespacedName = { namespace: "default", name: "my-deployment" };
      appsV1Api.readNamespacedDeployment.mockRejectedValue(
        new Error("Failed to get deployment"),
      );

      await expect(
        deployment.listDeploymentPods(namespacedName),
      ).rejects.toThrow("Failed to get deployment");
      expect(appsV1Api.readNamespacedDeployment).toHaveBeenCalledWith(
        namespacedName.name,
        namespacedName.namespace,
      );
    });
  });
});

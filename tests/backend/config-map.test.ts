import * as k8s from "@kubernetes/client-node";
import { IncomingMessage } from "electron";
import {
  ApiVersion,
  IApiClientFactory,
} from "~/backend/kube-client/ApiClientFactory";
import { ConfigMap } from "~/backend/config-map";

jest.mock("~/backend/kube-client/ApiClientFactory");

describe("ConfigMap", () => {
  let apiClientFactory: jest.Mocked<IApiClientFactory>;
  let coreV1Api: jest.Mocked<k8s.CoreV1Api>;
  let configMap: ConfigMap;

  beforeEach(() => {
    coreV1Api = {
      listNamespacedConfigMap: jest.fn(),
      readNamespacedConfigMap: jest.fn(),
    } as unknown as jest.Mocked<k8s.CoreV1Api>;

    apiClientFactory = {
      getApiClient: jest.fn().mockReturnValue(coreV1Api),
    } as unknown as jest.Mocked<IApiClientFactory>;

    configMap = new ConfigMap(apiClientFactory);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("listConfigMaps", () => {
    it("should list config maps in the given namespace", async () => {
      const namespace = "default";
      const mockResponse = {
        body: { items: ["configMap1", "configMap2"] },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any;
      coreV1Api.listNamespacedConfigMap.mockResolvedValue(mockResponse);

      const result = await configMap.listConfigMaps(namespace);

      expect(apiClientFactory.getApiClient).toHaveBeenCalledWith(
        ApiVersion.CoreV1,
      );
      expect(coreV1Api.listNamespacedConfigMap).toHaveBeenCalledWith(namespace);
      expect(result).toEqual(mockResponse.body);
    });

    it("should handle errors when listing config maps", async () => {
      const namespace = "default";
      coreV1Api.listNamespacedConfigMap.mockRejectedValue(
        new Error("Failed to list config maps"),
      );

      await expect(configMap.listConfigMaps(namespace)).rejects.toThrow(
        "Failed to list config maps",
      );
      expect(apiClientFactory.getApiClient).toHaveBeenCalledWith(
        ApiVersion.CoreV1,
      );
      expect(coreV1Api.listNamespacedConfigMap).toHaveBeenCalledWith(namespace);
    });
  });

  describe("getConfigMap", () => {
    it("should get a config map by name and namespace", async () => {
      const namespacedName = { namespace: "default", name: "my-config-map" };
      const mockResponse = {
        body: { metadata: { name: "my-config-map" } },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any;
      coreV1Api.readNamespacedConfigMap.mockResolvedValue(mockResponse);

      const result = await configMap.getConfigMap(namespacedName);

      expect(apiClientFactory.getApiClient).toHaveBeenCalledWith(
        ApiVersion.CoreV1,
      );
      expect(coreV1Api.readNamespacedConfigMap).toHaveBeenCalledWith(
        namespacedName.name,
        namespacedName.namespace,
      );
      expect(result).toEqual(mockResponse.body);
    });

    it("should handle errors when getting a config map", async () => {
      const namespacedName = { namespace: "default", name: "my-config-map" };
      coreV1Api.readNamespacedConfigMap.mockRejectedValue(
        new Error("Failed to get config map"),
      );

      await expect(configMap.getConfigMap(namespacedName)).rejects.toThrow(
        "Failed to get config map",
      );
      expect(apiClientFactory.getApiClient).toHaveBeenCalledWith(
        ApiVersion.CoreV1,
      );
      expect(coreV1Api.readNamespacedConfigMap).toHaveBeenCalledWith(
        namespacedName.name,
        namespacedName.namespace,
      );
    });
  });
});

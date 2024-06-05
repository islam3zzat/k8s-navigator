import * as k8s from "@kubernetes/client-node";
import {
  ApiClientFactory,
  ApiVersion,
  IApiClientFactory,
} from "~/backend/kube-client/ApiClientFactory";

const mockMakeApiClient = jest.fn();

jest.mock("@kubernetes/client-node", () => {
  const actualModule = jest.requireActual("@kubernetes/client-node");
  return {
    ...actualModule,
    KubeConfig: jest.fn().mockImplementation(() => {
      return {
        makeApiClient: mockMakeApiClient,
      };
    }),
  };
});

describe("ApiClientFactory", () => {
  let apiClientFactory: IApiClientFactory;

  beforeEach(() => {
    const kubeConfig = new k8s.KubeConfig();
    apiClientFactory = new ApiClientFactory(kubeConfig);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call makeApiClient with CoreV1Api for CoreV1 version", () => {
    apiClientFactory.getApiClient(ApiVersion.CoreV1);
    expect(mockMakeApiClient).toHaveBeenCalledWith(k8s.CoreV1Api);
  });

  it("should call makeApiClient with BatchV1Api for BatchV1 version", () => {
    apiClientFactory.getApiClient(ApiVersion.BatchV1);
    expect(mockMakeApiClient).toHaveBeenCalledWith(k8s.BatchV1Api);
  });

  it("should call makeApiClient with KubernetesObjectApi for KubernetesObject version", () => {
    apiClientFactory.getApiClient(ApiVersion.KubernetesObject);
    expect(mockMakeApiClient).toHaveBeenCalledWith(k8s.KubernetesObjectApi);
  });

  it("should call makeApiClient with AppsV1Api for AppsV1 version", () => {
    apiClientFactory.getApiClient(ApiVersion.AppsV1);
    expect(mockMakeApiClient).toHaveBeenCalledWith(k8s.AppsV1Api);
  });

  it("should throw an error for an unsupported API version", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => apiClientFactory.getApiClient(100 as any)).toThrow(
      "Unsupported API version",
    );
  });
});

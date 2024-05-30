import * as k8s from "@kubernetes/client-node";
import * as net from "net";
import { PortForwardManager } from "../../../src/backend/kube-client";

jest.mock("@kubernetes/client-node");
jest.mock("net");

describe("PortForwardManager", () => {
  let kubeConfig: k8s.KubeConfig;
  let portForwardManager: PortForwardManager;

  beforeEach(() => {
    kubeConfig = new k8s.KubeConfig();
    portForwardManager = new PortForwardManager(kubeConfig);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("portForward", () => {
    it("should create a port-forward successfully", async () => {
      const serverMock = {
        once: jest.fn((event, callback) => {
          if (event === "listening") {
            callback();
          }
        }),
        listen: jest.fn(),
      };
      (net.createServer as jest.Mock).mockReturnValue(serverMock);

      await expect(
        portForwardManager.portForward({
          namespace: "default",
          name: "test-pod",
          targetPort: 8080,
          userPort: 3000,
        }),
      ).resolves.toBeUndefined();

      expect(net.createServer).toHaveBeenCalled();
      expect(serverMock.listen).toHaveBeenCalledWith(3000, "127.0.0.1");
    });

    it("should throw an error if port-forward already exists", async () => {
      const serverMock = {
        once: jest.fn((event, callback) => {
          if (event === "listening") {
            callback();
          }
        }),
        listen: jest.fn(),
      };
      (net.createServer as jest.Mock).mockReturnValue(serverMock);

      await portForwardManager.portForward({
        namespace: "default",
        name: "test-pod",
        targetPort: 8080,
        userPort: 3000,
      });

      await expect(
        portForwardManager.portForward({
          namespace: "default",
          name: "test-pod",
          targetPort: 8080,
          userPort: 3000,
        }),
      ).rejects.toThrow("Port-forward already exists for this pod");
    });
  });

  describe("closePortForward", () => {
    it("should close an existing port-forward successfully", async () => {
      const serverMock = {
        once: jest.fn((event, callback) => {
          if (event === "listening") {
            callback();
          }
        }),
        listen: jest.fn(),
        close: jest.fn(),
      };
      (net.createServer as jest.Mock).mockReturnValue(serverMock);

      await portForwardManager.portForward({
        namespace: "default",
        name: "test-pod",
        targetPort: 8080,
        userPort: 3000,
      });

      portForwardManager.closePortForward({
        namespace: "default",
        name: "test-pod",
        targetPort: 8080,
        userPort: 3000,
      });

      expect(serverMock.close).toHaveBeenCalled();
    });

    it("should throw an error if the port-forward does not exist", () => {
      expect(() => {
        portForwardManager.closePortForward({
          namespace: "default",
          name: "nonexistent-pod",
          targetPort: 8080,
          userPort: 3000,
        });
      }).toThrow("Port-forward does not exist for this pod");
    });
  });

  describe("listPortForwards", () => {
    it("should return the list of current port-forwards", async () => {
      const serverMock = {
        once: jest.fn((event, callback) => {
          if (event === "listening") {
            callback();
          }
        }),
        listen: jest.fn(),
      };
      (net.createServer as jest.Mock).mockReturnValue(serverMock);

      await portForwardManager.portForward({
        namespace: "default",
        name: "test-pod",
        targetPort: 8080,
        userPort: 3000,
      });

      const portForwards = portForwardManager.listPortForwards();
      expect(portForwards).toEqual([
        {
          namespace: "default",
          name: "test-pod",
          targetPort: 8080,
          userPort: 3000,
        },
      ]);
    });
  });

  describe("closeAllPortForwards", () => {
    it("should close all port-forwards", async () => {
      const serverMock = {
        once: jest.fn((event, callback) => {
          if (event === "listening") {
            callback();
          }
        }),
        listen: jest.fn(),
        close: jest.fn((callback) => callback()),
      };
      (net.createServer as jest.Mock).mockReturnValue(serverMock);

      await portForwardManager.portForward({
        namespace: "default",
        name: "test-pod",
        targetPort: 8080,
        userPort: 3000,
      });

      await portForwardManager.closeAllPortForwards();
      expect(serverMock.close).toHaveBeenCalled();
      expect(portForwardManager.listPortForwards()).toHaveLength(0);
    });
  });
});

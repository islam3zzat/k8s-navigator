import * as k8s from "@kubernetes/client-node";
import * as net from "net";
import { Readable, Writable } from "node:stream";
import { NamespacedName } from "../types";

export interface IPortForwardHandler {
  portForward(
    namespace: string,
    podName: string,
    targetPort: number,
    userPort: number,
    outputStream: Writable,
    errStream: Writable,
    inputStream: Readable,
  ): void;
}

export interface IPortForward {
  namespace: string;
  name: string;
  targetPort: number;
  userPort: number;
}

export class PortForwardManager {
  private portForwards: Array<IPortForward & { server: net.Server }> = [];
  constructor(private kubeConfig: k8s.KubeConfig) {}

  public portForward = ({
    namespace,
    name,
    targetPort,
    userPort,
  }: NamespacedName & { targetPort: number; userPort: number }) => {
    return new Promise<void>((resolve, reject) => {
      // const instance = KubeClient.getInstance();
      const match = this.portForwards.find(
        (server) =>
          server.namespace === namespace &&
          server.name === name &&
          server.targetPort === targetPort,
      );
      if (match) {
        throw new Error("Port-forward already exists for this pod");
      }

      const forward = new k8s.PortForward(this.kubeConfig);

      // This simple server just forwards traffic from itself to a service running in kubernetes
      // -> localhost:8080 -> port-forward-tunnel -> kubernetes-pod
      // This is basically equivalent to 'kubectl port-forward ...' but in TypeScript.
      const server = net.createServer((socket) => {
        forward.portForward(
          namespace,
          name,
          [targetPort],
          socket,
          null,
          socket,
        );
      });

      server.once("error", (err) => {
        reject(err);
      });

      server.once("listening", () => {
        this.portForwards.push({
          namespace,
          name,
          targetPort: targetPort,
          userPort,
          server,
        });
        resolve();
      });

      server.listen(userPort);
    });
  };

  public closePortForward = ({
    namespace,
    name,
    targetPort,
    userPort,
  }: IPortForward) => {
    const index = this.findPortForwardIndex(
      namespace,
      name,
      targetPort,
      userPort,
    );
    if (index === -1) {
      throw new Error("Port-forward does not exist for this pod");
    }

    return new Promise<void>((resolve, reject) => {
      const portForward = this.portForwards[index];
      portForward.server.once("close", () => {
        this.portForwards.splice(index, 1);
        resolve();
      });
      portForward.server.once("error", (err) => {
        reject(err);
      });
      portForward.server.close();
    });
  };

  public listPortForwards = () => {
    return this.portForwards.map(
      ({ namespace, name, userPort, targetPort }) => ({
        namespace,
        name,
        userPort,
        targetPort,
      }),
    );
  };

  public closeAllPortForwards = async () => {
    await Promise.all(
      this.portForwards.map(
        ({ server }) =>
          new Promise<void>((resolve, reject) => {
            server.once("close", () => {
              resolve();
            });
            server.once("error", (err) => {
              reject(err);
            });
            server.close();
          }),
      ),
    );
    this.portForwards = [];
  };

  private isPortForwardExists = (
    namespace: string,
    name: string,
    port: number,
  ): boolean => {
    return this.portForwards.some(
      (server) =>
        server.namespace === namespace &&
        server.name === name &&
        server.targetPort === port,
    );
  };

  private findPortForwardIndex = (
    namespace: string,
    name: string,
    port: number,
    userPort: number,
  ): number => {
    return this.portForwards.findIndex(
      (server) =>
        server.namespace === namespace &&
        server.name === name &&
        server.targetPort === port &&
        server.userPort === userPort,
    );
  };

  private createPortForwardServer = (
    namespace: string,
    name: string,
    port: number,
    userPort: number,
    portForwardHandler: IPortForwardHandler,
    reject: (reason?: unknown) => void,
    resolve: (value?: void | PromiseLike<void>) => void,
  ): net.Server => {
    const server = net.createServer((socket) => {
      portForwardHandler.portForward(
        namespace,
        name,
        port,
        userPort,
        socket,
        null,
        socket,
      );
    });

    server.once("error", (err) => {
      reject(err);
    });

    server.once("listening", () => {
      this.portForwards.push({
        namespace,
        name,
        targetPort: port,
        userPort,
        server,
      });
      resolve();
    });

    return server;
  };
}

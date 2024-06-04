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

type RunningPortForward = IPortForward & {
  server: net.Server;
  sockets: Set<net.Socket>;
};

export class PortForwardManager {
  private portForwards: Array<RunningPortForward> = [];
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
      const sockets = new Set<net.Socket>();
      const portForward: RunningPortForward = {
        namespace,
        name,
        targetPort: targetPort,
        userPort,
        server,
        sockets: sockets,
      };

      server.on("connection", (socket) => {
        sockets.add(socket);
        server.once("close", () => {
          sockets.delete(socket);
        });
      });

      server.once("error", (err) => {
        reject(err);
      });

      server.once("listening", () => {
        this.portForwards.push(portForward);
        resolve();
      });

      server.listen(userPort);
    });
  };

  public closePortForward = async ({
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
    const portForward = this.portForwards[index];

    await this.drainPortForward(portForward);

    this.portForwards.splice(index, 1);
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
      this.portForwards.map((portForward) =>
        this.drainPortForward(portForward),
      ),
    );

    this.portForwards = [];
  };

  drainPortForward = (portForward: RunningPortForward) => {
    if (!portForward?.server) return Promise.resolve();

    return new Promise<void>((resolve, reject) => {
      const sockets = portForward.sockets;

      for (const socket of sockets) {
        socket.destroy();
        sockets.delete(socket);
      }

      portForward.server.once("close", () => {
        resolve();
      });
      portForward.server.once("error", (err) => {
        reject(err);
      });

      portForward.server.close();
    });
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
}

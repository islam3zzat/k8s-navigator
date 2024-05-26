// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron";
import { IpcActions } from "./shared/ipc-actions";

contextBridge.exposeInMainWorld(
  "k8sNavigator",
  Object.fromEntries(
    Object.keys(IpcActions).map((key) => [
      key,
      (...args: string[]) => ipcRenderer.invoke(key, ...args),
    ]),
  ),
);
contextBridge.exposeInMainWorld("logs", {
  tailPodLogs: (
    namespace: string,
    name: string,
    container: string,
    follow?: boolean,
  ) => ipcRenderer.send("stream-pod-logs", namespace, name, container, follow),
  onLogData: (callback: (data: string) => void) =>
    ipcRenderer.on("log-data", (event, data) => callback(data)),
  onLogEnd: (callback: () => void) =>
    ipcRenderer.on("log-end", () => callback()),
  onLogError: (callback: (error: string) => void) =>
    ipcRenderer.on("log-error", (event, error) => callback(error)),

  stopLogStream: (namespace: string, name: string, container: string) =>
    ipcRenderer.send("stop-stream-pod-logs", namespace, name, container),
});

contextBridge.exposeInMainWorld("electron", {
  findInPage: (text: string) => ipcRenderer.send("find-in-page", text),
  stopFindInPage: () => ipcRenderer.send("stop-find-in-page"),
  findNext: (text: string) => ipcRenderer.send("find-next", text),
  findPrevious: (text: string) => ipcRenderer.send("find-previous", text),
});

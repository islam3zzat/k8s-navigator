import { exec } from "child_process";
import { BrowserWindow, IpcMain } from "electron";
import { PassThrough } from "node:stream";
import { ipcControllers, pod } from "./ipc-controllers";

type Args = {
  mainWindow: BrowserWindow;
  ipcMain: IpcMain;
};
export const initIpcMainEvents = ({ mainWindow, ipcMain }: Args) => {
  // App controllers
  Object.entries(ipcControllers).forEach(([channel, listener]) => {
    ipcMain.removeHandler(channel);
    ipcMain.handle(channel, listener);
  });

  // Find in page
  ipcMain.on("find-in-page", (event, text) => {
    mainWindow?.webContents.findInPage(text);
  });

  ipcMain.on("stop-find-in-page", () => {
    mainWindow?.webContents.stopFindInPage("clearSelection");
  });

  ipcMain.on("find-next", (event, text) => {
    mainWindow?.webContents.findInPage(text, { forward: true, findNext: true });
  });

  ipcMain.on("find-previous", (event, text) => {
    mainWindow?.webContents.findInPage(text, {
      forward: false,
      findNext: true,
    });
  });

  // Logs
  const streamsMap: Record<string, PassThrough> = {};

  ipcMain.on("stream-pod-logs", (event, namespace, name, container, follow) => {
    pod.tailLogs({ namespace, name, container, follow }).then((readStream) => {
      streamsMap[`${namespace}/${name}/${container}`] = readStream;
      readStream.on("data", (chunk) => {
        event.sender.send("log-data", chunk.toString());
      });

      readStream.on("end", () => {
        event.sender.send("log-end");
      });

      readStream.on("error", (error) => {
        event.sender.send("log-error", error.message);
      });
    });
  });

  ipcMain.on("stop-stream-pod-logs", (event, namespace, name, container) => {
    const key = `${namespace}/${name}/${container}`;
    const stream = streamsMap[key];
    if (stream) {
      stream.destroy();
      streamsMap[key] = null;
    }
  });

  // Exec commands
  ipcMain.on("run-command", (event, command) => {
    const child = exec(command);

    child.stdout.on("data", (data) => {
      event.sender.send("command-output", data);
    });

    child.stderr.on("data", (data) => {
      event.sender.send("command-error", data);
    });

    child.on("close", () => {
      event.sender.send("command-end");
    });
  });
};

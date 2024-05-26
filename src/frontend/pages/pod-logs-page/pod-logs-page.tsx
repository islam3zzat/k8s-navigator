import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ArticleIcon from "@mui/icons-material/Article";
import Paper from "@mui/material/Paper";
import { useAppContext } from "../../app-context";

const PodLogsPage = () => {
  const { podName, containerName } = useParams<{
    podName: string;
    containerName: string;
  }>();
  const { state, dispatch } = useAppContext();

  useEffect(() => {
    const path = `/pods/${podName}/logs/${containerName}`;
    const isInBreadCrumbs = state.breadCrumbs.some(
      (crumb) => crumb.path === path,
    );
    if (!isInBreadCrumbs) {
      dispatch({
        type: "SET_BREADCRUMB",
        breadCrumb: state.breadCrumbs.concat({
          label: "Logs",
          path: path,
          iconName: "Pod",
        }),
      });
    }
  }, [state.breadCrumbs, dispatch, podName, containerName]);
  //   window.logs.onLogEnd(() => {console.log("done!")})
  //   window.logs.onLogError(err => {console.log("got error", err)})
  //   window.logs.onLogData(console.log)
  //   window.logs.tailPodLogs("import-api", "test-import-api-resequencer-59f669985c-tzv5z", "resequencer", true)
  //   window.logs.stopLogStream("import-api", "test-import-api-resequencer-59f669985c-tzv5z", "resequencer")
  // setup log streaming hooks
  const [logs, setLogs] = useState<string[]>([]);
  useEffect(() => {
    if (!state.activeNamespace) {
      return;
    }
    window.logs.onLogEnd(() => {
      console.log("done!");
    });
    window.logs.onLogError((err) => {
      console.log("got error", err);
    });

    window.logs.onLogData((log: string) => {
      setLogs((prevLogs: string[]) => [...prevLogs, log]);
    });

    window.logs.tailPodLogs(
      state.activeNamespace,
      podName,
      containerName,
      true,
    );
    return () => {
      window.logs.stopLogStream(state.activeNamespace, podName, containerName);
    };
  }, [containerName, podName, state.activeNamespace]);

  const downloadLogs = useCallback(() => {
    const blob = new Blob(logs, { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${podName}-${containerName}-logs.txt`;
    a.click();

    URL.revokeObjectURL(url);
  }, [containerName, logs, podName]);

  return (
    <Stack spacing={4}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        spacing={2}
      >
        <ArticleIcon aria-label="View pod logs" fontSize="large" />
        <Typography variant="h4">Logs</Typography>
        <Button startIcon={<FileDownloadIcon />} onClick={downloadLogs}>
          Download
        </Button>
      </Stack>
      {/* Sticky position */}
      <Paper elevation={2} sx={{ p: 2 }}>
        <Stack spacing={2}>
          {logs.map((log: string, index: number) => (
            <Typography
              sx={{
                p: 1,
                textWrap: "wrap",
                mb: 2,
                width: "min(max-content, 100%)",
                lineBreak: "anywhere",
              }}
              key={index}
            >
              {log}
            </Typography>
          ))}
        </Stack>
      </Paper>
    </Stack>
  );
};

export default PodLogsPage;

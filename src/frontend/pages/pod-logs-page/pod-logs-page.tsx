import InfoIcon from "@mui/icons-material/Info";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import Stack from "@mui/material/Stack";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";
import ArticleIcon from "@mui/icons-material/Article";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import { FixedSizeList as List, ListChildComponentProps } from "react-window";
import { useAppContext } from "../../app-context";

type Severity = "error" | "warning" | "info";
const logToSeverity = (log: string): Severity => {
  if (log.includes("ERROR")) {
    return "error";
  }
  if (log.includes("WARN")) {
    return "warning";
  }
  return "info";
};

const LogIcon = ({ severity }: { severity: Severity }) => {
  switch (severity) {
    case "error":
      return <ErrorOutlineIcon sx={{ mt: 1.5 }} color="error" />;
    case "warning":
      return <WarningAmberIcon sx={{ mt: 1.5 }} color="warning" />;
    default:
      return <InfoIcon sx={{ mt: 1.5 }} />;
  }
};

const PodLogsPage = () => {
  const { podName, containerName } = useParams<{
    podName: string;
    containerName: string;
  }>();
  const { state, dispatch } = useAppContext();
  const [selectedValue, setSelectedValue] = useState<Severity | "all">("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value as Severity | "all");
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const controlProps = (item: string) => ({
    checked: selectedValue === item,
    onChange: handleChange,
    value: item,
    name: "log-severity-radio-button",
    inputProps: { "aria-label": item },
  });

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
      setLogs((prevLogs: string[]) => [
        ...prevLogs,
        ...log.split("\n").filter(Boolean),
      ]);
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

  const filteredLogs = useMemo(() => {
    const severityFilteredLogs =
      selectedValue === "all"
        ? logs
        : logs.filter((log) => logToSeverity(log) === selectedValue);
    return severityFilteredLogs.filter((log) =>
      log.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [logs, selectedValue, searchTerm]);

  const Row = ({ index, style }: ListChildComponentProps) => {
    const log = filteredLogs[index];
    const severity = logToSeverity(log);

    return (
      <div style={style}>
        <Stack direction="row" spacing={0}>
          <LogIcon severity={severity} />
          <Typography
            sx={{
              p: 1,
              textWrap: "wrap",
              mb: 2,
              width: "min(max-content, 100%)",
              lineBreak: "anywhere",
            }}
          >
            {log}
          </Typography>
        </Stack>
      </div>
    );
  };

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
        alignItems="flex-end"
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
          <Stack direction="row" alignItems="center" spacing={2}>
            <FormControlLabel
              value="all"
              control={<Radio {...controlProps("all")} />}
              label="All"
            />
            <FormControlLabel
              value="info"
              control={<Radio color="info" {...controlProps("info")} />}
              label="Info"
            />
            <FormControlLabel
              value="warning"
              control={<Radio color="warning" {...controlProps("warning")} />}
              label="Warning"
            />
            <FormControlLabel
              value="error"
              control={<Radio color="error" {...controlProps("error")} />}
              label="Error"
            />
            <TextField
              label="Search logs"
              aria-label="Search logs"
              value={searchTerm}
              onChange={handleSearchChange}
              variant="outlined"
              size="small"
            />
          </Stack>
          <List
            height={400}
            itemCount={filteredLogs.length}
            itemSize={150}
            width="100%"
          >
            {Row}
          </List>
        </Stack>
      </Paper>
    </Stack>
  );
};

export default PodLogsPage;

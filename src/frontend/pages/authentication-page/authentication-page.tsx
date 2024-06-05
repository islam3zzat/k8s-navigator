import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import DeleteIcon from "@mui/icons-material/Delete";
import Typography from "@mui/material/Typography";
import StoredCommandList from "./stored-commands-list";
import CommandOutput from "./command-output";
import AddCommandForm from "./add-command-form";

const AuthenticationPage: React.FC = () => {
  const [name, setName] = React.useState<string>("");
  const [command, setCommand] = React.useState<string>("");
  const [storedData, setStoredData] = React.useState<
    { name: string; command: string }[]
  >([]);
  const [output, setOutput] = React.useState<string>("");
  const outputRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const data = localStorage.getItem("authenticationData");
    if (data) {
      setStoredData(JSON.parse(data));
    }

    window.commandRunner.onCommandOutput((data: string) => {
      setOutput((prev) => prev + data);
    });

    window.commandRunner.onCommandError((error: string) => {
      setOutput((prev) => prev + `${error}`);
    });

    window.commandRunner.onCommandEnd(() => {
      setOutput((prev) => prev + "\nCommand execution ended.\n");
    });

    return () => {
      window.commandRunner.removeAllListeners();
    };
  }, []);

  React.useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  const handleSave = () => {
    const newData = { name, command };
    const updatedData = [...storedData, newData];
    localStorage.setItem("authenticationData", JSON.stringify(updatedData));
    setStoredData(updatedData);
    setName("");
    setCommand("");
  };

  const handleCommandClick = (command: string) => {
    setOutput("");
    window.commandRunner.runCommand(command);
  };

  const handleDelete = (index: number) => {
    const updatedData = storedData.filter((_, i) => i !== index);
    localStorage.setItem("authenticationData", JSON.stringify(updatedData));
    setStoredData(updatedData);
  };

  return (
    <Box p={2} width={800}>
      <Stack spacing={2}>
        <Typography variant="h4">Authentication Command Runner</Typography>
        <Typography variant="caption" mt={2}>
          This page allows you to save and run authentication commands. <br />
          You can enter a name and a shell command for authentication, save it,
          and then run the command by clicking the corresponding button. The
          output of the command will be displayed below.
        </Typography>
        <Box mt={4}>
          <Typography variant="h6">Stored Auth Commands</Typography>
          <StoredCommandList
            storedData={storedData}
            onCommandClick={handleCommandClick}
            onDelete={handleDelete}
          />
        </Box>
        <Box mt={4}>
          <CommandOutput output={output} outputRef={outputRef} />
        </Box>
        <Box mt={4}>
          <AddCommandForm
            name={name}
            command={command}
            onNameChange={(e) => setName(e.target.value)}
            onCommandChange={(e) => setCommand(e.target.value)}
            onSave={handleSave}
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default AuthenticationPage;

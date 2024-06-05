import React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
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
      setOutput((prev: string) => prev + data);
    });

    window.commandRunner.onCommandError((error: string) => {
      setOutput((prev: string) => prev + `${error}`);
    });

    window.commandRunner.onCommandEnd(() => {
      setOutput((prev: string) => prev + "\nCommand execution ended.\n");
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
    const updatedData = storedData.filter(
      (_: unknown, i: number) => i !== index,
    );
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
        <Stack spacing={2}>
          <Typography variant="h6">Stored Auth Commands</Typography>
          <StoredCommandList
            storedData={storedData}
            onCommandClick={handleCommandClick}
            onDelete={handleDelete}
          />

          {storedData.length > 0 ? (
            <CommandOutput output={output} outputRef={outputRef} />
          ) : null}

          <AddCommandForm
            name={name}
            command={command}
            onNameChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
            onCommandChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCommand(e.target.value)
            }
            onSave={handleSave}
          />
        </Stack>
      </Stack>
    </Box>
  );
};

export default AuthenticationPage;

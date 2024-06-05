import * as React from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

interface CommandOutputProps {
  output: string;
  outputRef: React.RefObject<HTMLDivElement>;
}

const CommandOutput: React.FC<CommandOutputProps> = ({ output, outputRef }) => {
  return (
    <Stack>
      <Typography variant="h6">Command Output</Typography>
      <Paper
        variant="outlined"
        sx={{ p: 2, height: 200, overflowY: "auto" }}
        ref={outputRef}
      >
        <pre>{output}</pre>
      </Paper>
    </Stack>
  );
};

export default CommandOutput;

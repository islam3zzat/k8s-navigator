import * as React from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

interface AddCommandFormProps {
  name: string;
  command: string;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCommandChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
}

const AddCommandForm: React.FC<AddCommandFormProps> = ({
  name,
  command,
  onNameChange,
  onCommandChange,
  onSave,
}) => {
  return (
    <Stack spacing={2}>
      <Typography variant="h6">Add New Auth Command</Typography>
      <TextField label="Name" value={name} onChange={onNameChange} fullWidth />
      <TextField
        label="Auth Command"
        value={command}
        onChange={onCommandChange}
        fullWidth
      />
      <Button variant="contained" onClick={onSave}>
        Save
      </Button>
    </Stack>
  );
};

export default AddCommandForm;

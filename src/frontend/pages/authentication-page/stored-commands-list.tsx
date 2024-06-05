import * as React from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import DeleteIcon from "@mui/icons-material/Delete";

interface StoredCommandListProps {
  storedData: { name: string; command: string }[];
  onCommandClick: (command: string) => void;
  onDelete: (index: number) => void;
}

const StoredCommandList: React.FC<StoredCommandListProps> = ({
  storedData,
  onCommandClick,
  onDelete,
}) => {
  return (
    <Grid container spacing={2}>
      {storedData.map((data, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => onCommandClick(data.command)}
            >
              {data.name}
            </Button>
            <IconButton onClick={() => onDelete(index)}>
              <DeleteIcon />
            </IconButton>
          </Stack>
        </Grid>
      ))}
    </Grid>
  );
};

export default StoredCommandList;

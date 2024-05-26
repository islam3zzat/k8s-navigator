import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { V1Secret } from "@kubernetes/client-node";
import SecurityIcon from "@mui/icons-material/Security";
import CopyAllIcon from "@mui/icons-material/CopyAll";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

const SecretGeneralTab = ({ resource: secret }: { resource: V1Secret }) => {
  return (
    <Stack spacing={4}>
      <Stack spacing={2}>
        <Stack direction="row" spacing={2} alignItems="center">
          <InsertDriveFileIcon aria-label="Secret type" fontSize="small" />
          <Typography variant="h6">Type</Typography>
          <Typography>{secret?.type}</Typography>
        </Stack>
      </Stack>
      <Stack spacing={2}>
        <Stack direction="row" spacing={2} alignItems="center">
          <SecurityIcon aria-label="Secret data" fontSize="small" />
          <Typography variant="h6">Data</Typography>
          <Stack spacing={2}>
            {secret?.data &&
              Object.keys(secret.data).map((key) => (
                <Stack key={key} spacing={0} justifyContent="center">
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    spacing={2}
                  >
                    <Typography>{key}</Typography>
                    <Box>
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            window.atob(secret.data[key]),
                          );
                        }}
                        startIcon={
                          <CopyAllIcon aria-label="Copy decoded secret" />
                        }
                      >
                        Copy Decoded
                      </Button>
                    </Box>
                  </Stack>
                  <Typography sx={{ width: 400 }} noWrap>
                    {secret.data[key]}
                  </Typography>
                </Stack>
              ))}
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default SecretGeneralTab;

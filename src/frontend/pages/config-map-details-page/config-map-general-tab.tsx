import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { V1ConfigMap } from "@kubernetes/client-node";
import SecurityIcon from "@mui/icons-material/Security";
import Button from "@mui/material/Button";
import StorageIcon from "@mui/icons-material/Storage";
import CopyAllIcon from "@mui/icons-material/CopyAll";
import { TabComponentProps } from "../../layout/resource-details-page";

export const ConfigMapGeneralTab: React.FC<TabComponentProps<V1ConfigMap>> = ({
  resource: configMap,
}: {
  resource: V1ConfigMap;
}) => {
  return (
    <Stack spacing={4}>
      <Stack spacing={2}>
        {configMap?.data && (
          <Stack direction="row" spacing={2} alignItems="center">
            <SecurityIcon fontSize="small" aria-label="ConfigMap data" />
            <Typography variant="h6">Data</Typography>
            <Stack spacing={2}>
              {Object.keys(configMap.data).map((key) => (
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
                          navigator.clipboard.writeText(configMap.data[key]);
                        }}
                        startIcon={<CopyAllIcon aria-label="Copy data" />}
                      >
                        Copy
                      </Button>
                    </Box>
                  </Stack>
                  <Typography sx={{ width: 400 }} noWrap>
                    {configMap.data[key]}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Stack>
        )}
        {configMap?.binaryData && (
          <Stack direction="row" spacing={2} alignItems="center">
            <StorageIcon aria-label="Binary data" fontSize="small" />
            <Typography variant="h6">Binary Data</Typography>
            <Stack spacing={2}>
              {Object.keys(configMap?.binaryData).map((key) => (
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
                          navigator.clipboard.writeText(configMap.data[key]);
                        }}
                        startIcon={<CopyAllIcon aria-label="Copy data" />}
                      >
                        Copy
                      </Button>
                    </Box>
                  </Stack>
                  <Typography sx={{ width: 400 }} noWrap>
                    {configMap.data[key]}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};

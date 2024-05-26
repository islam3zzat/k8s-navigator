import { Link as RouterLink } from "react-router-dom";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { V1ServiceAccount } from "@kubernetes/client-node";
import SecurityIcon from "@mui/icons-material/Security";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import LockIcon from "@mui/icons-material/Lock";

export const ServiceAccountGeneralTab = ({
  resource: serviceAccount,
}: {
  resource: V1ServiceAccount;
}) => {
  return (
    <Stack spacing={4}>
      <Stack spacing={2}>
        <Stack direction="row" spacing={2} alignItems="center">
          <InsertDriveFileIcon
            aria-label="Image pull secrets"
            fontSize="small"
          />
          <Typography variant="h6">Image pull secrets</Typography>
          {!serviceAccount?.imagePullSecrets?.length && (
            <Typography>None</Typography>
          )}
        </Stack>
        {serviceAccount?.imagePullSecrets?.map((secret) => (
          <Typography key={secret.name} variant="body1">
            {secret.name}
          </Typography>
        ))}
      </Stack>
      <Stack spacing={2}>
        <Stack direction="row" spacing={2} alignItems="center">
          <SecurityIcon
            aria-label="Automount service account token"
            fontSize="small"
          />
          <Typography variant="h6">Automount service account token</Typography>
          {serviceAccount?.automountServiceAccountToken ? (
            <Typography>True</Typography>
          ) : (
            <Typography>False</Typography>
          )}
        </Stack>
      </Stack>
      <Stack spacing={2}>
        <Stack direction="row" spacing={2} alignItems="center">
          <LockIcon aria-label="Secrets" fontSize="small" />
          <Typography variant="h6">Secrets</Typography>
          <Stack spacing={2}>
            {serviceAccount?.secrets?.map((secret) => (
              <Link
                key={secret.name}
                component={RouterLink}
                flex={1}
                to={`/secrets/${secret.name}`}
                underline="hover"
              >
                <Typography variant="body1">{secret.name}</Typography>
              </Link>
            ))}
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

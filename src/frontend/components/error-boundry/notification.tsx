import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

type Props = {
  isOpen: boolean;
  handleClose: () => void;
  message: string;
  severity: "error" | "info" | "success" | "warning";
  autoHideDuration?: number;
};

const defaultAutoHideDuration = 6000;
const Notification = ({
  isOpen,
  handleClose,
  message,
  severity,
  autoHideDuration,
}: Props) => (
  <Snackbar
    open={isOpen}
    autoHideDuration={autoHideDuration || defaultAutoHideDuration}
    onClose={handleClose}
    role="alert"
  >
    <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
      {message}
    </Alert>
  </Snackbar>
);

export default Notification;

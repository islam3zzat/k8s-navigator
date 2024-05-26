import Box from "@mui/material/Box";
import React from "react";
import Button from "@mui/material/Button";
import type { ButtonOwnProps } from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type Props = {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  onConfirm: () => void;
  children: React.ReactNode;
  primaryButtonText?: string;
  primaryButtonColor?: ButtonOwnProps["color"];
  secondaryButtonText?: string;
  secondaryButtonColor?: ButtonOwnProps["color"];
};
export const ConfirmationDialog = ({
  isOpen,
  title,
  onClose,
  onConfirm,
  children,
  primaryButtonText,
  primaryButtonColor,
  secondaryButtonText,
  secondaryButtonColor,
}: Props) => {
  return (
    <Dialog open={isOpen} TransitionComponent={Transition} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <Box sx={{ p: 6 }}>{children}</Box>
      <DialogActions>
        <Button color={primaryButtonColor} onClick={onConfirm}>
          {primaryButtonText || "Confirm"}
        </Button>
        <Button color={secondaryButtonColor} onClick={onClose}>
          {secondaryButtonText || "Cancel"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

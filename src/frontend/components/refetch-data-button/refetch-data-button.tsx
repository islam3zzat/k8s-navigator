import { motion } from "framer-motion";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import RefreshIcon from "@mui/icons-material/Refresh";
import { forwardRef } from "react";

const IconButtonWithRef = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ ...props }, ref) => {
    return <IconButton {...props} ref={ref} />;
  },
);
IconButtonWithRef.displayName = "IconButtonWithRef";

const MotionIconButton = motion(IconButtonWithRef);
MotionIconButton.displayName = "MotionIconButton";

const refreshIconVariants = {
  initial: { rotate: 0 },
  hover: { scale: 1.2 },
  tap: { scale: 0.9 },
  refreshing: {
    // Continuous rotation when refreshing
    rotate: 360,
    transition: { duration: 1, ease: "linear", repeat: Infinity },
  },
};

type Props = {
  isLoading: boolean;
  refetch: () => void;
};
export const RefetchDataButton = ({ isLoading, refetch }: Props) => {
  return (
    <MotionIconButton
      variants={refreshIconVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      animate={isLoading ? "refreshing" : "initial"}
      color="primary"
      aria-label="Refetch data"
      size="small"
      onClick={refetch}
    >
      <RefreshIcon />
    </MotionIconButton>
  );
};

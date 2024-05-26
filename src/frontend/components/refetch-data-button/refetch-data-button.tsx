import { motion } from "framer-motion";
import IconButton from "@mui/material/IconButton";
import RefreshIcon from "@mui/icons-material/Refresh";

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
    <motion.div
      variants={refreshIconVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      animate={isLoading ? "refreshing" : "initial"}
    >
      <IconButton
        color="primary"
        aria-label="Refetch data"
        size="small"
        onClick={refetch}
      >
        <RefreshIcon />
      </IconButton>
    </motion.div>
  );
};

import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

type Props = {
  onWatchToggle: () => void;
  isWatching: boolean;
};
export const WatchCheckbox = ({ isWatching, onWatchToggle }: Props) => {
  const [showAnimation, setShowAnimation] = useState(false);

  const handleWatchToggle = useCallback(() => {
    setShowAnimation(true); // Trigger the animation
    setTimeout(() => setShowAnimation(false), 500);
    onWatchToggle();
  }, [onWatchToggle]);

  return (
    <FormControlLabel
      checked={isWatching}
      onChange={handleWatchToggle}
      control={
        <motion.div
          animate={showAnimation ? { scale: 1.2 } : { scale: 1 }} // Scale the checkbox slightly
          transition={{ type: "spring", stiffness: 300, damping: 10 }} // Springy animation
        >
          <Checkbox aria-label="Watch changes" />
        </motion.div>
      }
      label="Watch changes"
    />
  );
};

import * as React from "react";
import useTheme from "@mui/material/styles/useTheme";

type Props = {
  isPrimary?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  size?: number;
};
export const ResourceIcon: React.FC<Props> = ({ isPrimary, icon, size }) => {
  const theme = useTheme();
  if (!theme) return null;
  const iconWidth = theme.spacing(size || 2);
  const primaryColor = theme.palette.primary.main;
  const color = isPrimary ? primaryColor : theme.palette.grey[800];

  return React.createElement(icon, {
    style: {
      width: iconWidth,
      color,
      "--workload-color": color,
    },
  });
};

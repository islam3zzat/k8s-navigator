import { FC, lazy, Suspense } from "react";
import useTheme from "@mui/material/styles/useTheme";
import { ClipLoader } from "react-spinners";
import iconLoader from "./icon-loader";
import type { ResourceName } from "./icon-loader";

type Props = {
  isPrimary?: boolean;
  resourceName: ResourceName;
  size?: number;
};

export const ResourceIcon: FC<Props> = ({ isPrimary, resourceName, size }) => {
  const theme = useTheme();

  const LazyIcon = iconLoader[resourceName];

  if (!theme) return null;
  const iconWidth = theme.spacing(size || 2);
  const primaryColor = theme.palette.primary.main;
  const color = isPrimary ? primaryColor : theme.palette.grey[800];

  return (
    <Suspense
      fallback={
        <ClipLoader color={theme.palette.primary.main} size={iconWidth} />
      }
    >
      <LazyIcon
        style={{
          width: iconWidth,
          color,
          "--workload-color": color,
        }}
      />
    </Suspense>
  );
};

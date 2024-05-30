import { ClipLoader } from "react-spinners";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";

type Props = {
  isFullPage?: boolean;
};
const LoadingFallback = ({ isFullPage }: Props) => {
  const theme = useTheme();

  const height = isFullPage ? "100vh" : "20vh";

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height={height}
    >
      <ClipLoader color={theme.palette.primary.main} />
    </Box>
  );
};

export default LoadingFallback;

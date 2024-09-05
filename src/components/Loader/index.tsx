import { Box, BoxProps, CircularProgress, styled } from "@mui/material";
import { FC } from "react";

const Container = styled(Box)(() => ({
  width: "100%",
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "absolute",
  top: 0,
  left: 0,
  color: "#000",
  zIndex: 9999,
}));

interface LoaderProps extends BoxProps {}

const Loader: FC<LoaderProps> = (props) => {
  return (
    <Container {...props}>
      <CircularProgress color="inherit" />
    </Container>
  );
};

export default Loader;

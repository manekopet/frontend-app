import styled from "@emotion/styled";
import { Box } from "@mui/material";
import React, { FC } from "react";

const Container = styled(Box)(() => ({
  position: "relative",
  paddingTop: "100%",
}));

const Content = styled(Box)(() => ({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
}));

interface SquareBoxProps {
  children: React.ReactNode;
}

const SquareBox: FC<SquareBoxProps> = ({ children }) => {
  return (
    <Container>
      <Content>{children}</Content>
    </Container>
  );
};

export default SquareBox;

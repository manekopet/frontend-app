import ContentBorderWrapper from "@/components/presentation/ContentBorderWrapper";
import { MainContent } from "@/components/presentation/MainContent";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import { AppBar, Box, Button, Grid, IconButton, Toolbar } from "@mui/material";
import React from "react";
import AnimatedNumbers from "react-animated-numbers";
import { useNavigate } from "react-router-dom";
import Rectangle from "src/assets/images/polygon.png";
import { BoxSpin, GroupBtn } from "./Predict.styled";

export default function Predict() {
  const [num1, setNum1] = React.useState(1);
  const [num2, setNum2] = React.useState(1);
  const [num3, setNum3] = React.useState(1);
  const navigate = useNavigate();
  const handleBack = () => {
    navigate("/arcades");
  };
  return (
    <MainContent>
      <AppBar position="relative">
        <Toolbar disableGutters>
          <IconButton
            onClick={handleBack}
            size="small"
            edge="start"
            color="inherit"
            sx={{ mr: 2, background: "#fff" }}
          >
            <ArrowLeftIcon fontSize="small" />
          </IconButton>
          Prediction
        </Toolbar>
      </AppBar>
      <ContentBorderWrapper sx={{ p: "20px" }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <BoxSpin>
              <Box className="square">
                <AnimatedNumbers
                  includeComma
                  transitions={(index: any) => ({
                    type: "spring",
                    duration: index + 0.6,
                  })}
                  animateToNumber={num1}
                  fontStyle={{
                    fontSize: 40,
                    color: "#00ff2f",
                  }}
                />
              </Box>
              <Box className="rectangle">
                <img src={Rectangle} alt="rectangle" />
                <AnimatedNumbers
                  includeComma
                  transitions={(index: any) => ({
                    type: "spring",
                    duration: index + 1.6,
                  })}
                  className="number"
                  animateToNumber={num2}
                  fontStyle={{
                    fontSize: 40,
                    color: "#00ff2f",
                    zIndex: 1,
                  }}
                />
              </Box>
              <Box className="circle">
                <AnimatedNumbers
                  includeComma
                  transitions={(index: any) => ({
                    type: "spring",
                    duration: index + 2.1,
                  })}
                  animateToNumber={num3}
                  fontStyle={{
                    fontSize: 40,
                    color: "#00ff2f",
                  }}
                />
              </Box>
            </BoxSpin>
            <GroupBtn>
              <Button
                onClick={() => {
                  setNum1(Math.floor(Math.random() * 10));
                  setNum2(Math.floor(Math.random() * 10));
                  setNum3(Math.floor(Math.random() * 10));
                }}
                className="btn"
              >
                LOW
              </Button>
              <Button
                onClick={() => {
                  setNum1(Math.floor(Math.random() * 10));
                  setNum2(Math.floor(Math.random() * 10));
                  setNum3(Math.floor(Math.random() * 10));
                }}
                className="btn hight"
              >
                HIGHT
              </Button>
            </GroupBtn>
          </Grid>
        </Grid>
      </ContentBorderWrapper>
    </MainContent>
  );
}

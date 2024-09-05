import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const Content = styled(Box)(() => ({
  padding: "20px",
}));

export const BoxSpin = styled(Box)`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 60px;
  .square {
    width: 84px;
    height: 84px;
    background-color: #d3fbfe;
  }

  .rectangle {
    width: 100px;
    height: 84px;
    position: relative;

    .number {
      position: relative;
      top: 56%;
    }
    img {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 0;
    }
  }

  .circle {
    width: 84px;
    height: 84px;
    border-radius: 1000px;
    background-color: #fef2d3;
  }

  .circle,
  .rectangle,
  .square {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;
export const GroupBtn = styled(Box)`
  margin-top: 120px;
  display: flex;
  justify-content: space-between;
  gap: 24px;
  .btn {
    width: 100%;
    background: #fff;
    color: #a22f3c;
    font-size: 24px;
  }
  .hight {
    color: #00ff2f !important;
  }
`;

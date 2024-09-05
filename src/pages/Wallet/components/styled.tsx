import { styled } from "@mui/material";
import { Box } from "@mui/system";

export const Wrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  margin-top: 24px;
  height: calc(100vh - 200px);
  /* justify-content: space-between; */

  .group-input {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .select-token {
    height: 60px;

    position: relative;

    background: #ffffff;
    border: 1px solid #0d1615;
    box-shadow: 1px 1px 0px #0d1615;
    border-radius: 10px;
    color: black;
  }

  .title {
    color: #0d1615;
    font-family: Geologica;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    letter-spacing: 0.07px;
    margin-bottom: 24px;
  }

  .input {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 8px 15px;
    margin-top: 24px;
    height: 60px;

    position: relative;

    background: #ffffff;
    border: 1px solid #0d1615;
    box-shadow: 1px 1px 0px #0d1615;
    border-radius: 10px;

    display: flex;
    flex-direction: column;

    span {
      font-family: "Geologica";
      font-style: normal;
      font-weight: 300;
      font-size: 12px;
      line-height: 15px;
      letter-spacing: 0.0703846px;
      color: #ababab;
    }

    .input-token {
      display: flex;
      align-items: center;

      .token {
        font-family: "Geologica";
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        line-height: 18px;
        letter-spacing: 0.0703846px;

        color: #0d1615;
      }
    }

    .all {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 15px;
      cursor: pointer;

      font-weight: 500;
      font-size: 14px;
      line-height: 18px;
      letter-spacing: 0.0703846px;

      color: #0d1615;
    }
  }

  .input-amount {
    margin-top: 12px;
  }

  .balance {
    font-family: "Geologica";
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 15px;
    letter-spacing: 0.0703846px;
    color: #a688a4;
    margin-top: 24px;
  }

  .submit {
    margin-top: auto;
    border-radius: 10px;
    border: 1px solid #0d1615;
    background: #fed3e7;
    box-shadow: 1px 1px 0px 0px #0d1615;
    display: flex;
    width: 100%;
    height: 52px;
    padding: 13px 16px;
    justify-content: center;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
    text-transform: uppercase;
  }

  .view-history {
    margin-top: 12px;
    font-family: "Geologica";
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    color: #3d3d3d;
    text-decoration: underline;
    cursor: pointer;
  }
`;

export const SwitchTransfer = styled(Box)`
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 0 24px;
  width: 100%;
  background: #ffffff;
  border: 1px solid #0d1615;
  box-shadow: 1px 1px 0px #0d1615;
  border-radius: 10px;

  .switch-btn {
    display: flex;
    justify-content: center;
    align-items: center;

    width: 34px;
    height: 34px;
    min-width: 34px;
    background: #ffffff;
    border: 1px solid #0d1615;
    box-shadow: 1px 1px 0px #0d1615;
    border-radius: 50px;
    padding: 0;
  }
  .form {
    width: 100%;
  }
  .form-swap {
    width: 100%;
    .divider {
      height: 1px;
      width: 100%;
      border: 1px solid #0d1615;
    }
    .form-from,
    .form-to {
      display: flex;
      gap: 10px;
      align-items: center;
      padding: 24px 0;

      width: 150px;
      input {
        width: 150px;
      }

      svg {
        min-width: 22px;
        height: 22px;
      }

      .text-label {
        font-family: "Geologica";
        font-style: normal;
        font-weight: 300;
        font-size: 14px;
        line-height: 15px;
        letter-spacing: 0.0703846px;

        color: #ababab;
        min-width: 80px;
      }
    }

    .text {
      font-family: "Geologica";
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      line-height: 18px;
      letter-spacing: 0.0703846px;
      color: #0d1615;
    }
  }
`;

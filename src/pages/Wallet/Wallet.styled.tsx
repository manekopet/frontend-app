import { Box, Button, Grid, styled } from "@mui/material";

export const BoxSummaryBalance = styled(Box)`
  display: flex;
  flex-direction: column;
  text-align: center;

  .text-total {
    font-size: 12px;
    color: #a688a4;
    font-weight: 500;
  }

  .text-balance {
    font-size: 32px;
    font-weight: 600;
  }
`;

export const SquareButton = styled(Button)(() => ({
  fontSize: "12px !important",
  boxShadow: "1px 1px 0px 0px #0D1615",
  background: "#fff",
  width: 44,
  height: 44,
  minWidth: 44,
  padding: 0,
}));

export const ActionWalletButton = styled(Grid)`
  flex-direction: column;
  display: flex;
  align-items: center;
  gap: 12px;

  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 18px;
  letter-spacing: 0.0703846px;

  color: #0d1615;
`;

export const AccountWalletWrapper = styled(Box)(() => ({
  background: "#fff",
  boxShadow: "1px 1px 0px 0px #0D1615",
  color: "#0D1615",
  borderRadius: "10px",
  border: "1px solid #0D1615",
  marginBottom: "24px",
}));

export const AccountWallet = styled(Box)(() => ({
  padding: "15px",
  display: "flex",
  alignItems: "center",
  borderBottom: "1px solid #0D1615",

  "&:last-child": {
    borderBottom: "none",
  },
}));

export const AccountWalletAmount = styled(Box)(() => ({
  marginLeft: "10px",
  flexGrow: 1,
  fontSize: "14px",
  fontWeight: 500,
  lineHeight: "17.5px",
  letterSpacing: "0.07px",
}));

export const CircleButton = styled(Button)(() => ({
  borderRadius: "50px",
  fontSize: "12px !important",
  boxShadow: "1px 1px 0px 0px #0D1615",
}));

export const TransferButton = styled(Button)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 17px 16px;
  gap: 8px;

  height: 52px;

  background: #fef2d3;
  border: 1px solid #0d1615;
  box-shadow: 1px 1px 0px #0d1615;
  border-radius: 10px;
`;

import { authSelector } from "@/redux/features/auth/selectors";
import { ISymbol } from "@/types/auth";
import { balanceDisplayer, convertTokenDecimals } from "@/utils/convert";
import { Box, styled } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CoinButton } from "../Wallet";
import {
  AccountWallet,
  AccountWalletAmount,
  AccountWalletWrapper,
  TransferButton,
} from "../Wallet.styled";

const Spacing = styled(Box)`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: calc(100svh - 250px);
`;

export default function SpendingAccount() {
  const balance = useSelector(authSelector.selectBalance);
  const navigate = useNavigate();

  return (
    <Spacing>
      <Box>
        <Box sx={{ mb: 1 }}>Spending account</Box>
        <AccountWalletWrapper>
          <AccountWallet>
            <CoinButton>
              <img
                style={{ width: 16 }}
                src="/assets/images/gem-token.gif"
                alt="loading..."
              />
            </CoinButton>
            <AccountWalletAmount>
              {balanceDisplayer(
                +convertTokenDecimals(balance[ISymbol.MGEM]?.balance + "", 9)
              )}{" "}
              {ISymbol.MGEM}
            </AccountWalletAmount>
          </AccountWallet>
          <AccountWallet>
            <CoinButton>
              <img
                style={{ width: 16 }}
                src="https://cdn.manekopet.xyz/token/mp/logo.png"
                alt="loading..."
              />
            </CoinButton>
            <AccountWalletAmount>
              {balanceDisplayer(
                +convertTokenDecimals(balance[ISymbol.MP]?.balance + "", 9)
              )}{" "}
              {ISymbol.MP}
            </AccountWalletAmount>
          </AccountWallet>
        </AccountWalletWrapper>
      </Box>
      <TransferButton onClick={() => navigate("/wallet/deposit")}>
        TRANSFER To Wallet
      </TransferButton>
    </Spacing>
  );
}

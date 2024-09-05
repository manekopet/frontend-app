import { ReactComponent as ManaIcon } from "@/assets/svg/mana.svg";
import { useSelector } from "@/hooks/redux";
import useReloadAccountBalance from "@/hooks/useReloadAccountBalance";
import { authSelector } from "@/redux/features/auth/selectors";
import { ISymbol } from "@/types/auth";
import {
  balanceDisplayer,
  convertTokenDecimals,
  shortenNumber,
} from "@/utils/convert";
import { Box, styled } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Container = styled(Box)(() => ({
  display: "flex",
  background: "#fff",
  boxShadow: "1px 1px 0px 0px #0D1615",
  color: "#0D1615",
  borderRadius: "50px",
  height: "38px",
  border: "1px solid #0D1615",
  padding: "10px 5px",
  cursor: "pointer",
}));

const WalletBox = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  fontWeight: 500,
  fontSize: "10px",
  letterSpacing: "0.07px",

  "& svg": {
    marginRight: "2px",
  },

  "&:first-of-type": {
    marginRight: "10px",
  },
}));

const HeaderWallet = () => {
  useReloadAccountBalance(8000);

  const navigate = useNavigate();

  const balance = useSelector(authSelector.selectBalance);
  const [tokenGemShorten, symbolGemShorten] = shortenNumber(
    +convertTokenDecimals(balance[ISymbol.MGEM]?.balance.toString() || "0", 9)
  );

  const handleGoToWallet = () => {
    navigate("/wallet");
  };

  return (
    <Container onClick={handleGoToWallet}>
      <WalletBox>
        <img
          style={{ width: 16, marginRight: 5 }}
          src="/assets/images/gem-token.gif"
          alt="loading..."
        />
        {balanceDisplayer(+tokenGemShorten.toFixed(2))} {symbolGemShorten}
      </WalletBox>
      <WalletBox>
        <ManaIcon />0
      </WalletBox>
    </Container>
  );
};

export default HeaderWallet;

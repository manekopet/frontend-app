import { useContext, useState } from "react";

// Plugins

// Adapters
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, Button, CircularProgress, styled } from "@mui/material";
import {
  AuthContext,
  SocialLogin,
  WalletLogin,
} from "../../providers/AuthProvider";

import { useSelector } from "@/hooks/redux";
import { authSelector } from "@/redux/features/auth/selectors";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  BitgetWalletName,
  PhantomWalletName,
  SolflareWalletName,
} from "@solana/wallet-adapter-wallets";
import { useDispatch } from "react-redux";
import "./LoginPage.css";

//Services

const Container = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  backgroundColor: "#F7E8F6",
}));

export const WalletAmountBox = styled(Button)(() => ({
  width: "100%",
  display: "flex",
  justifyContent: "left !important",
  background: "#fff",
  boxShadow: " 1px 1px 0px 0px #0D1615",
  borderRadius: "10px",
  border: "1px solid #0D1615",
  padding: "10px",
  fontSize: "18px",
  fontStyle: "normal",
  fontWeight: 400,
  lineHeight: "15px",
  letterSpacing: "0.07px",
  alignItems: "center",
  textTransform: "none",
}));
export const WalletAmountContinue = styled(Button)(() => ({
  width: "100%",
  display: "flex",
  justifyContent: "space-between !important",
  background: "#fff",
  boxShadow: " 1px 1px 0px 0px #0D1615",
  borderRadius: "10px",
  border: "1px solid #0D1615",
  padding: "10px",
  fontSize: "18px",
  fontStyle: "normal",
  fontWeight: 400,
  lineHeight: "15px",
  letterSpacing: "0.07px",
  alignItems: "center",
  textTransform: "none",
}));

const Logo = styled("img")(() => ({
  // marginTop: "30%",
  // width: "188px",
  // height: "200px",
  width: "300px",
  imageRendering: "pixelated",
}));
const LogoModal = styled("img")(() => ({
  width: "98px",
}));

const LogoSocial = styled("img")(() => ({
  width: "24px",
  marginRight: "20px",
}));

const Content = styled(Box)(() => ({
  padding: "0 50px 50px 50px",
  marginTop: "-50px",
}));

const ContentTitle = styled(Box)(() => ({
  textAlign: "center",
  fontSize: "17px",
  fontStyle: "normal",
  fontWeight: 500,
  lineHeight: "normal",
  letterSpacing: "0.07px",
}));

const ContentDescription = styled(Box)(() => ({
  textAlign: "center",
  fontSize: "14px",
  fontStyle: "normal",
  fontWeight: 300,
  lineHeight: "normal",
  letterSpacing: "0.07px",
  marginTop: 25,
}));

const SocialButtons = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}));

const LoginButton = styled(Button)(() => ({
  width: "150px",
}));

const LoginPage: React.FC = () => {
  const dispatch = useDispatch();
  const authState = useSelector(authSelector.selectorDomain);
  const { web3auth, login, loading, logout } = useContext(AuthContext);
  const { select } = useWallet();
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [openLoginModalWallet, setOpenLoginModalWallet] = useState(false);

  type Anchor = "top" | "left" | "bottom" | "right";

  const toggleDrawer =
    (anchor: Anchor, open: boolean, type: string) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      if (type == "social") {
        setOpenLoginModal(open);
      } else {
        setOpenLoginModalWallet(open);
      }
    };

  const loggedInView = (
    <>
      <div className="flex-container">
        <Button variant="contained" onClick={logout} className="card">
          Log Out
        </Button>
      </div>
      <div id="console" style={{ whiteSpace: "pre-line" }}>
        <p style={{ whiteSpace: "pre-line" }}>Logged in Successfully!</p>
      </div>
    </>
  );

  const unloggedInView = (
    <>
      <LoginButton variant="contained" onClick={() => setOpenLoginModal(true)}>
        Login
      </LoginButton>
      {/* 
      <LoginButton variant="contained" onClick={() => logout}>
        Logout
      </LoginButton> */}
    </>
  );

  return (
    <Container>
      <SwipeableDrawer
        anchor={"bottom"}
        open={openLoginModal}
        onClose={toggleDrawer("bottom", false, "social")}
        onOpen={toggleDrawer("bottom", true, "social")}
        className="modal-login-web3"
      >
        <div className="modal-container-wrapper">
          <p className="title-modal" style={{ marginBottom: "20px" }}>
            Log in or Sign Up
          </p>
          <div className="logo-modal">
            <p className="sub-title-modal">MANEKO</p>
          </div>
          <WalletAmountBox
            sx={{ mb: "16px" }}
            disabled={loading.google}
            onClick={() => {
              login({ tSocial: SocialLogin.GOOGLE });
            }}
          >
            <LogoSocial src="/assets/google-icon.png" alt="Logo" />
            {loading.google ? (
              <CircularProgress color="inherit" size={24} />
            ) : (
              "Google"
            )}
          </WalletAmountBox>
          <WalletAmountBox
            disabled={loading.twitter}
            onClick={() => {
              login({ tSocial: SocialLogin.TWITTER });
            }}
            sx={{ mb: "16px" }}
          >
            <LogoSocial src="/assets/twitter-icon.png" alt="Logo" />
            {loading.twitter ? (
              <CircularProgress color="inherit" size={24} />
            ) : (
              "Twitter"
            )}
          </WalletAmountBox>
          <WalletAmountBox
            disabled={loading.apple}
            onClick={() => {
              login({ tSocial: SocialLogin.APPLE });
            }}
            sx={{ mb: "16px" }}
          >
            <LogoSocial src="/assets/apple-icon.png" alt="Logo" />
            {loading.apple ? (
              <CircularProgress color="inherit" size={24} />
            ) : (
              "Apple"
            )}
          </WalletAmountBox>
          <WalletAmountContinue
            sx={{ mb: "16px" }}
            onClick={() => {
              setOpenLoginModal(false);
              setOpenLoginModalWallet(true);
            }}
          >
            <div className="wrap-input-continue">
              <LogoSocial src="/assets/wallet-icon.png" alt="Logo" />
              <p className="continue-wallet">Continue with a wallet</p>
            </div>
          </WalletAmountContinue>
        </div>
      </SwipeableDrawer>
      <SwipeableDrawer
        anchor={"bottom"}
        open={openLoginModalWallet}
        onClose={toggleDrawer("bottom", false, "wallet")}
        onOpen={toggleDrawer("bottom", true, "wallet")}
        className="modal-login-web3"
      >
        <div className="modal-container-wrapper">
          <div className="wrapper-modal-wallet">
            <div
              className="wallet-modal-back"
              onClick={() => {
                setOpenLoginModal(true);
                setOpenLoginModalWallet(false);
              }}
            >
              <ArrowBackIcon />
            </div>
            <p className="title-modal">Log in or Sign Up</p>
          </div>

          <WalletAmountBox
            sx={{ mb: "16px" }}
            disabled={loading.solflare}
            onClick={() => {
              select(SolflareWalletName);
              login({ tWallet: WalletLogin.SOLFLARE });
            }}
          >
            <LogoSocial src="/assets/solflare-icon.png" alt="Logo" />
            {loading.solflare ? (
              <CircularProgress color="inherit" size={24} />
            ) : (
              "Solflare Wallet"
            )}
          </WalletAmountBox>
          <WalletAmountBox
            disabled={loading.phantom}
            onClick={() => {
              select(PhantomWalletName);
              login({ tWallet: WalletLogin.PHANTOM });
            }}
            sx={{ mb: "16px" }}
          >
            <LogoSocial src="/assets/phantom-icon.png" alt="Logo" />
            {loading.phantom ? (
              <CircularProgress color="inherit" size={24} />
            ) : (
              "Phantom Wallet"
            )}
          </WalletAmountBox>
          <WalletAmountBox
            disabled={loading.bitget}
            onClick={() => {
              select(BitgetWalletName);
              login({ tWallet: WalletLogin.BITGET });
            }}
            sx={{ mb: "16px" }}
          >
            <LogoSocial
              src="/assets/bitget-icon.png"
              style={{
                borderRadius: "1000px",
              }}
              alt="Logo"
            />
            {loading.bitget ? (
              <CircularProgress color="inherit" size={24} />
            ) : (
              "Bitget Wallet"
            )}
          </WalletAmountBox>
          <WalletAmountBox
            // disabled={loading.bitget}
            onClick={async () => {
              const gateProvider = window?.gatewallet?.solana;
              if (gateProvider) {
                const resp = await gateProvider.connect();
                console.log(resp.publicKey.toString());
              }
              // select(BitgetWalletName);
              // login({ tWallet: WalletLogin.BITGET });
            }}
            sx={{ mb: "16px" }}
          >
            <LogoSocial
              src="/assets/gate-logo.png"
              style={{
                borderRadius: "1000px",
              }}
              alt="Logo"
            />
            Gate Wallet
          </WalletAmountBox>
        </div>
      </SwipeableDrawer>
      <Logo src="assets/images2/login-cat.png" alt="Logo" />
      <Content>
        <ContentTitle>
          Play, nurture, battle – discover joy in ManekoPet.
        </ContentTitle>
        <ContentDescription>
          Sign up with your email, we’ll create a Solana wallet for you.
        </ContentDescription>
      </Content>
      <SocialButtons>
        {authState?.user !== null && web3auth?.connected
          ? loggedInView
          : unloggedInView}
      </SocialButtons>
    </Container>
  );
};

export default LoginPage;

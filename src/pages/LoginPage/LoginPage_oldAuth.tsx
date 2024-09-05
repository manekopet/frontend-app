import { IProvider } from "@web3auth/base";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RPC from "../../components/WalletModal/solonaRPC";

// Plugins

// Adapters
import { Box, Button, CircularProgress, styled } from "@mui/material";
import { AuthContext } from "../../providers/AuthProvider_oldAuth";

import * as authApi from "@/apis/auth";
import { useSelector } from "@/hooks/redux";
import { logoutAsync } from "@/redux/features/auth/saga";
import { authSelector } from "@/redux/features/auth/selectors";
import authSlice from "@/redux/features/auth/slice";
import { getErrorMessage } from "@/types/error";
import { getSignature } from "@/utils/solana";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import "./LoginPage.css";

//Services

const Container = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  backgroundColor: "#f4f4f4",
}));

export const WalletAmountBox = styled(Box)(() => ({
  width: "100%",
  display: "flex",
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
}));

const Logo = styled("img")(() => ({
  marginTop: "30%",
  width: "188px",
  height: "200px",
}));
const LogoModal = styled("img")(() => ({
  width: "98px",
}));

const LogoSocial = styled("img")(() => ({
  width: "24px",
  marginRight: "20px",
}));

const Content = styled(Box)(() => ({
  padding: "50px",
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
}));

const SocialButtons = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}));

const LoginButton = styled(Button)(() => ({
  width: "150px",
}));

interface LoginPageProps {
  setIsLoggedIn: (loggedIn: boolean) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ setIsLoggedIn }) => {
  const dispatch = useDispatch();
  const [provider, setProvider] = useState<IProvider | null>(null);
  const authState = useSelector(authSelector.selectorDomain);
  const navigate = useNavigate();
  const { web3auth, login, loading } = useContext(AuthContext);
  const accessToken = useSelector(authSelector.selectAccessToken);
  // const token = useSelector(authSelector.selectAccessToken);
  // const userLogged = useSelector(authSelector.selectUser);
  useEffect(() => {
    const init = async () => {
      if (web3auth && web3auth.connected) {
        try {
          if (accessToken) {
            // to do user
            return;
          }
          const web3authProvider: any = await web3auth.connect();
          const rpc = new RPC(web3authProvider);
          const address = await rpc.getAccounts();
          const infoUser = await web3auth.getUserInfo();
          const result = await authApi.requestNonce(address[0]);
          const { nonce, publicAddress, signed } = result as any;
          const signature: string = await getSignature(
            publicAddress,
            nonce,
            web3authProvider
          );
          const { token, user } = await authApi.login(
            publicAddress,
            signature,
            nonce,
            infoUser || {}
          );
          if (token) {
            window.token = token;
            if (authState?.referral && !user?.invitedBy) {
              await authApi.updateReferralProfile(
                publicAddress,
                authState.referral
              );
            }
            const profile: any = await authApi.getProfile();
            dispatch(
              authSlice.actions.loginSuccess({
                accessToken: token,
                user: profile?.user,
                signed: signed,
                balance: profile?.balance,
                socialData: profile?.socialdata,
              })
            );
            navigate("/onboarding");
          } else {
            // TODO display error
          }
        } catch (e: any) {
          // TODO display error
          const errMessage = getErrorMessage(e);
          toast(`auth login err: ${errMessage}`);
        }
      }
    };

    init();
  }, [web3auth?.connected]);

  const logout = async () => {
    if (!web3auth) {
      return;
    }
    if (!web3auth.connected) {
      setProvider(null);
      dispatch(authSlice.actions.setReferral(""));
      dispatch(logoutAsync());
      window.token = "";
      localStorage.removeItem("skipScreenInviteCode");
      return;
    }
    await web3auth.logout();
    setProvider(null);
    dispatch(authSlice.actions.setReferral(""));
    dispatch(logoutAsync());
    window.token = "";
    localStorage.removeItem("skipScreenInviteCode");
  };

  const [openLoginModal, setOpenLoginModal] = useState(false);

  type Anchor = "top" | "left" | "bottom" | "right";

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setOpenLoginModal(open);
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
    <LoginButton
      variant="contained"
      disabled={loading}
      // onClick={() => setOpenLoginModal(true)}
      onClick={login}
    >
      {loading ? <CircularProgress color="inherit" size={24} /> : "Login"}
    </LoginButton>
  );

  return (
    <Container>
      <SwipeableDrawer
        anchor={"bottom"}
        open={openLoginModal}
        onClose={toggleDrawer("bottom", false)}
        onOpen={toggleDrawer("bottom", true)}
        className="modal-login-web3"
      >
        <div className="modal-container-wrapper">
          <p className="title-modal">Log in or Sign Up</p>
          <div className="logo-modal">
            <p className="sub-title-modal">MANEKO</p>
          </div>
          <WalletAmountBox sx={{ mb: "16px" }}>
            <LogoSocial src="/assets/google-icon.png" alt="Logo" />
            Google
          </WalletAmountBox>
          <WalletAmountBox sx={{ mb: "16px" }}>
            <LogoSocial src="/assets/twitter-icon.png" alt="Logo" />
            Twitter
          </WalletAmountBox>
          <WalletAmountBox sx={{ mb: "16px" }}>
            <LogoSocial src="/assets/apple-icon.png" alt="Logo" />
            Apple
          </WalletAmountBox>
          <WalletAmountBox sx={{ mb: "16px" }}>
            <LogoSocial src="/assets/solflare-icon.png" alt="Logo" />
            Solflare Wallet
          </WalletAmountBox>
        </div>
      </SwipeableDrawer>
      <Logo src="/assets/logo.png" alt="Logo" />
      <Content>
        <ContentTitle>Own and grow your Maneko pet.</ContentTitle>
        <ContentDescription>
          Sign up with your email, we'll create a Solana wallet for you.
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

import * as authApi from "@/apis/auth";
import { ReactComponent as ManaIcon } from "@/assets/svg/mana.svg";
import { MainContent } from "@/components/presentation/MainContent";
import useReloadAccountBalance from "@/hooks/useReloadAccountBalance";
import { authSelector } from "@/redux/features/auth/selectors";
import authSlice from "@/redux/features/auth/slice";
import { styled, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "../../hooks/redux";
import useAccounts from "../../hooks/useAccounts";
import { AuthContext } from "../../providers/AuthProvider";

const Content = styled(Box)(() => ({
  padding: "15px 20px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  backgroundColor: "#F7E8F6",
}));

const ContentDescription = styled(Box)(() => ({
  fontSize: "14px",
  fontStyle: "normal",
  fontWeight: 300,
  lineHeight: "normal",
  letterSpacing: "0.07px",
  marginBottom: "20px",
}));

const ContentTitle = styled(Box)(() => ({
  fontSize: "20px",
  fontStyle: "normal",
  fontWeight: 400,
  lineHeight: "normal",
  letterSpacing: "0.07px",
  fontFamily: "Geologica",
  marginBottom: "20px",
}));
const SwapInputBoxInput = styled(Box)(() => ({
  fontSize: "14px",
  fontWeight: 500,
  lineHeight: "17.5px",
  letterSpacing: "0.07px",
  width: "100%",

  "& input": {
    padding: 0,
    fontSize: "14px",
    fontWeight: 500,
    lineHeight: "17.5px",
    letterSpacing: "0.07px",
    width: "100%",
  },
}));

const GuideModalBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  background: "#fff",
  padding: theme.spacing(3),
  textAlign: "center",
}));

const GuideModalTitle = styled(Box)(() => ({
  fontSize: "20px",
  fontWeight: "500",
  lineHeight: "20px",
  letterSpacing: "0.07px",
  textAlign: "center",
  marginBottom: "30px",
}));

const GuideModalContent = styled(Box)(() => ({
  fontSize: "14px",
  fontWeight: "400",
  lineHeight: "20px",
  letterSpacing: "0.07px",
  textAlign: "center",
  marginBottom: "30px",

  "& svg": {
    verticalAlign: "middle",
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  borderRadius: "10px !important",
  overflow: "hidden",
  background: "#FFF",
  border: "1px solid #0D1615",
  textAlign: "center",
}));

const Onboarding = () => {
  useReloadAccountBalance(5000);
  const { address } = useAccounts();
  const authState = useSelector(authSelector.selectorDomain);
  const { logout } = useContext(AuthContext);
  const [inviteCode, setInviteCode] = useState(authState?.referral || "");
  const [isLoading, setIsLoading] = useState(false);
  const [openGuide, setOpenGuide] = useState(false);

  const dispatch = useDispatch();

  const handleChange = (e: any) => {
    setInviteCode(e.target.value);
  };

  const handleUpdateReferraCode = async () => {
    if (inviteCode === "") {
      toast.error("Invite Code is required");
      return;
    }
    try {
      setIsLoading(true);
      const result: any = await authApi.updateReferralProfile(
        address,
        inviteCode
      );
      if (result?.message) {
        toast.error(result?.message);
        return;
      }
      if (result?.user) {
        const airdropItemPrice = result?.airdrop?.itemPrice || 0;
        if (airdropItemPrice > 0) {
          setOpenGuide(true);
        } else {
          const profile: any = await authApi.getProfile();
          dispatch(
            authSlice.actions.loginSuccess({
              accessToken: window.token,
              user: profile?.user,
              balance: profile?.balance,
              socialData: profile?.socialdata,
            })
          );
        }
      }
    } catch (e: any) {
      console.log("ERROR");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseGuide = async () => {
    const profile: any = await authApi.getProfile();
    dispatch(
      authSlice.actions.loginSuccess({
        accessToken: window.token,
        user: profile?.user,
        balance: profile?.balance,
        socialData: profile?.socialdata,
      })
    );
    setOpenGuide(false);
  };

  useEffect(() => {
    if (authState.referral) {
      handleUpdateReferraCode();
    }
  }, [authState.referral]);

  return (
    <MainContent>
      <ContentTitle>Got an Invite code? </ContentTitle>
      <ContentDescription>
        Maneko is currently in Beta. Join our discord to get invite code from
        fellow members
      </ContentDescription>
      <StyledTextField
        fullWidth={true}
        value={inviteCode}
        onChange={handleChange}
        placeholder="Enter invite code"
      />
      <Button
        disabled={isLoading}
        style={{ marginTop: "20px", marginBottom: "20px" }}
        onClick={handleUpdateReferraCode}
        fullWidth
        size="large"
      >
        PROCEED
      </Button>
      <div style={{ width: "100%", textAlign: "center" }}>
        <span className="login-anyway" onClick={() => logout()}>
          Logout
        </span>
      </div>
      <Modal
        sx={{ position: "absolute" }}
        container={() => document.getElementById("main-app")}
        open={openGuide}
      >
        <GuideModalBox>
          <GuideModalTitle>🌟 Starter Pack Unlocked! 🌟</GuideModalTitle>
          <GuideModalContent>
            Congratulations! You've just received:
            <br />
            <br />
            <ManaIcon style={{ marginRight: "10px" }} />
            100 $MGEM
          </GuideModalContent>
          <Button sx={{ px: 5, py: 1 }} onClick={handleCloseGuide}>
            CLOSE
          </Button>
        </GuideModalBox>
      </Modal>
    </MainContent>
  );
};

export default Onboarding;

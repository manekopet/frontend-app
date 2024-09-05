import * as referApi from "@/apis/refer";
import { ReactComponent as CopyIcon } from "@/assets/svg/copy.svg";
import { ReactComponent as InvitePlayerIcon } from "@/assets/svg/invite-player.svg";
import { ReactComponent as Rank1Icon } from "@/assets/svg/rank-1.svg";
import { ReactComponent as Rank2Icon } from "@/assets/svg/rank-2.svg";
import { ReactComponent as Rank3Icon } from "@/assets/svg/rank-3.svg";
import { MainContent } from "@/components/presentation/MainContent";
import { ENVS } from "@/configs/Configs.env";
import { useSelector } from "@/hooks/redux";
import { authSelector } from "@/redux/features/auth/selectors";
import { User } from "@/types/user";
import { balanceDisplayer } from "@/utils/convert";
import useAnalyticsEventTracker from "@/utils/useAnalyticsEventTracker";
import * as amplitude from "@amplitude/analytics-browser";
import {
  AppBar,
  Box,
  Button,
  Grid,
  styled,
  SvgIcon,
  Toolbar,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ReferralCodeBox = styled(Box)(({ theme }) => ({
  background: "#fff",
  boxShadow: "1px 1px 0px 0px #0D1615",
  color: "#0D1615",
  borderRadius: "10px",
  border: "1px solid #0D1615",
  padding: "15px",
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(4),
  display: "flex",
  alignIitems: "center",
}));

const ReferralCodeBoxTotal = styled(Box)(() => ({
  display: "flex",
}));

const ReferralCodeInvite = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  marginRight: theme.spacing(3),
}));

const ReferralCodeReward = styled(Box)(() => ({
  display: "flex",
  flexGrow: 1,
  flexDirection: "column",
  justifyContent: "center",
}));

const ReferralCodeLabel = styled(Box)(() => ({
  fontSize: "12px",
  fontWeight: 300,
  letterSpacing: "0.07px",
  color: "#A7A7A7",
}));

const ReferralCodeValue = styled(Box)(() => ({
  fontSize: "20px",
  fontWeight: 500,
  letterSpacing: "0.07px",
  display: "flex",
  alignItems: "center",
}));

const CopyButton = styled(Button)(({ theme }) => ({
  padding: `${theme.spacing(1)}`,
  fontSize: "12px",
  background: "#FEF2D3",
  fontWeight: 500,
  height: theme.spacing(5),
}));

const CopyButtonTitle = styled("span")(({ theme }) => ({
  color: "#ABABAB",
  flexGrow: 1,
  textAlign: "left",
  textTransform: "none",
  fontWeight: 300,
}));

const SubTitle = styled(Box)(({ theme }) => ({
  fontSize: theme.spacing(2.5),
  marginBottom: theme.spacing(3),
}));

const ReferItemBox = styled(Box)(({ theme }) => ({
  display: "flex",
  background: "#fff",
  borderRadius: "10px",
  justifyContent: "center",
  alignItems: "center",
  border: "1px solid rgba(13, 22, 21, 1)",
  boxShadow: "1px 1px 0px 0px rgba(13, 22, 21, 1)",
  padding: "12px",
  marginBottom: theme.spacing(1.5),
}));

const ReferItemRank = styled(Box)(() => ({
  marginRight: "12px",
}));

const ReferItemProfile = styled(Box)(() => ({
  flexGrow: "1",
}));
const ReferItemProfileName = styled(Box)(() => ({
  fontSize: "14px",
  fontWeight: "500",
  lineHeight: "18px",
  letterSpacing: "0.07px",
  textAlign: "left",
  marginBottom: "4px",
}));
const ReferItemProfilePoints = styled(Box)(() => ({
  fontSize: "12px",
  fontWeight: "300",
  lineHeight: "15px",
  letterSpacing: "0.07px",
  textAlign: "left",
  display: "flex",
  alignItems: "center",
}));

const FensButton = styled(Box)(() => ({
  minWidth: "90px",
  height: "38px",
  boxShadow: "1px 1px 0px 0px #0D1615",
  borderRadius: "50px",
  border: "1px solid #0D1615",
  margin: 0,
  textAlign: "center",
  background: "#D3FBFE",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "12px",
  fontWeight: 500,
}));

const RankButton = styled(Box)(({ theme }) => ({
  width: theme.spacing(5),
  height: theme.spacing(5),
  boxShadow: "1px 1px 0px 0px #0D1615",
  borderRadius: "10px",
  border: "1px solid #0D1615",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: theme.spacing(1.5),
  fontWeight: 500,
}));

const AppBarButton = styled(Button)(({ theme }) => ({
  borderRadius: 50,
  height: theme.spacing(4.75),
  fontSize: theme.spacing(1.75),
  fontWeight: 600,
  background: "#fff",
  textTransform: "capitalize",
}));

const Page: React.FC = () => {
  const navigate = useNavigate();
  const gaEventTracker = useAnalyticsEventTracker("ReferAndEarn");
  const profile = useSelector(authSelector.selectUser);
  const [referrals, setReferrals] = useState<User[]>([]);
  useEffect(() => {
    gaEventTracker("refer_and_earn_viewed", "refer_and_earn_viewed");
    amplitude.track("refer_and_earn_viewed");
  }, []);

  useEffect(() => {
    const getLeaderboards = async () => {
      try {
        const { data } = await referApi.referLeaderboard();
        setReferrals(data);
      } catch (e: any) {
        console.log(e);
      } finally {
      }
    };

    getLeaderboards();
  }, []);

  const handleBack = () => {
    navigate("/my-pet");
  };

  const getRankBackground = (rank: number): string => {
    if (rank === 1) {
      return "#FEFAD3";
    }
    if (rank === 2) {
      return "#FEFAD3";
    }
    if (rank === 3) {
      return "#FEFAD3";
    }
    return "#F7F1E9";
  };

  const getRankIcon = (rank: number): React.ReactNode => {
    if (rank === 1) {
      return (
        <RankButton sx={{ background: getRankBackground(rank) }}>
          <Rank1Icon />
        </RankButton>
      );
    }
    if (rank === 2) {
      return (
        <RankButton sx={{ background: getRankBackground(rank) }}>
          <Rank2Icon />
        </RankButton>
      );
    }
    if (rank === 3) {
      return (
        <RankButton sx={{ background: getRankBackground(rank) }}>
          <Rank3Icon />
        </RankButton>
      );
    }
    return (
      <RankButton sx={{ background: getRankBackground(rank) }}>
        #{rank}
      </RankButton>
    );
  };

  const handleGoToEarnMore = () => {
    navigate("/refer-earn-more");
  };

  return (
    <MainContent>
      <AppBar position="relative" sx={{ mb: 2 }}>
        <Toolbar disableGutters>Refer & Earn</Toolbar>
        {/* <Grid container spacing={2}>
          <Grid item xs>
            <Link to="/refer-earn-more">
              <AppBarButton fullWidth>Earn with Maneko</AppBarButton>
            </Link>
          </Grid>
          <Grid item xs>
            <Link to="/refer-and-earn">
              <AppBarButton fullWidth sx={{ background: "#D3FBFE" }}>
                Refer and Earn
              </AppBarButton>
            </Link>
          </Grid>
        </Grid> */}
      </AppBar>
      <ReferralCodeBox>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <ReferralCodeBoxTotal>
              <ReferralCodeInvite>
                <ReferralCodeLabel>Your invite</ReferralCodeLabel>
                <ReferralCodeValue>{profile?.frens || 0}</ReferralCodeValue>
              </ReferralCodeInvite>
              <ReferralCodeReward>
                <ReferralCodeLabel>Rewards</ReferralCodeLabel>
                <ReferralCodeValue>
                  <img
                    src="/assets/images/gem-token.gif"
                    alt="loading..."
                    width={18}
                    height={18}
                    style={{ width: "18px", marginRight: "5px" }}
                  />
                  {balanceDisplayer((profile?.incomeEarned || 0) / 10 ** 9, 3)}
                </ReferralCodeValue>
              </ReferralCodeReward>
            </ReferralCodeBoxTotal>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <CopyButton
                  fullWidth
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${ENVS.REACT_APP_WEB_ENDPOINT}/referral/${profile?.referralCode}`
                    );
                    toast.success("Copied to clipboard");
                  }}
                >
                  <CopyButtonTitle>Copy invite code</CopyButtonTitle>
                  {profile?.referralCode || ""}
                  <SvgIcon sx={{ ml: 1, mb: -1 }}>
                    <CopyIcon />
                  </SvgIcon>
                </CopyButton>
              </Grid>
              {/* <Grid item xs={6}>
                <CopyButton fullWidth onClick={handleGoToEarnMore}>
                  Earn more
                </CopyButton>
              </Grid> */}
            </Grid>
          </Grid>
        </Grid>
      </ReferralCodeBox>

      <SubTitle>Top Earnings</SubTitle>
      {referrals.map((r, idx) => {
        const rank = idx + 1;
        let name = r.name || "";
        if (name === "") {
          name = `${r.publicAddress.substring(
            0,
            5
          )}...${r.publicAddress.substring(
            r.publicAddress.length - 6,
            r.publicAddress.length
          )}`;
        }
        // if (name.indexOf("@") !== -1) {
        //   name = name.split("@")[0];
        // }
        if (name.length > 25) {
          name = `${name.substring(0, 20)}...`;
        }
        return (
          <ReferItemBox>
            <ReferItemRank>{getRankIcon(rank)}</ReferItemRank>
            <ReferItemProfile>
              <ReferItemProfileName>{name}</ReferItemProfileName>
              <ReferItemProfilePoints>
                <img
                  src="/assets/images/gem-token.gif"
                  alt="loading..."
                  width={14}
                  height={14}
                  style={{ marginRight: "5px" }}
                />
                {balanceDisplayer((r.incomeEarned || 0) / 10 ** 9 + "", 3)}
              </ReferItemProfilePoints>
            </ReferItemProfile>
            <Box>
              <FensButton>
                <InvitePlayerIcon style={{ marginRight: "5px" }} />
                {r.frens}
              </FensButton>
            </Box>
          </ReferItemBox>
        );
      })}
    </MainContent>
  );
};

export default Page;

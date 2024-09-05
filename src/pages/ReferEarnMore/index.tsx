import { ReactComponent as EarnCheckIcon } from "@/assets/svg/earn-check.svg";
import { ReactComponent as EarnDiamondIcon } from "@/assets/svg/earn-diamond.svg";
import { ReactComponent as EarnGemIcon } from "@/assets/svg/earn-gem.svg";
import { ReactComponent as EarnHeartIcon } from "@/assets/svg/earn-heart.svg";
import { ReactComponent as EarnStarIcon } from "@/assets/svg/earn-star.svg";
import { MainContent } from "@/components/presentation/MainContent";
import useAnalyticsEventTracker from "@/utils/useAnalyticsEventTracker";
import * as amplitude from "@amplitude/analytics-browser";
import {
  AppBar,
  Box,
  Button,
  Grid,
  Modal,
  TextField,
  styled,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DetailModel } from "./ReferEarnMore.styled";

const quests = [
  {
    icon: EarnHeartIcon,
    title: "Original Tweet",
    reward: "Earn 1000 PTS",
    is_completed: false,
  },
  {
    icon: EarnDiamondIcon,
    title: "Maneko Quote",
    reward: "Earn 1000 PTS",
    is_completed: false,
  },
  {
    icon: EarnCheckIcon,
    title: "Maneko Reply",
    reward: "Completed",
    is_completed: true,
  },
];

const EarnWithManekoTitleBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(4),
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
}));

const EarnWithManekoTitleImage = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(2),
}));

const EarnWithManekoTitleText = styled(Box)(({ theme }) => ({
  fontSize: theme.spacing(2.5),
  fontWeight: 600,
}));

const EarnWithManekoTitleSub = styled(Box)(({ theme }) => ({
  fontSize: theme.spacing(1.5),
  fontWeight: 300,
}));

const SubTitle = styled(Box)(({ theme }) => ({
  fontSize: theme.spacing(2.5),
  marginBottom: theme.spacing(1),
}));

const EarnItemBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  background: "#fff",
  borderRadius: "10px",
  border: "1px solid rgba(13, 22, 21, 1)",
  boxShadow: "1px 1px 0px 0px rgba(13, 22, 21, 1)",
  marginBottom: theme.spacing(2.5),
}));

const EarnItemQuestsBox = styled(EarnItemBox)(({ theme }) => ({
  "& > div": {
    borderBottom: "1px solid rgba(13, 22, 21, 1)",
  },
}));

const EarnItem = styled(Box)(({ theme }) => ({
  display: "flex",
  padding: "12px",
  cursor: "pointer",
}));

const EarnItemIcon = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isCompleted",
})<{ isCompleted: boolean }>(({ theme, isCompleted }) => ({
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
  marginRight: theme.spacing(1),
  background: isCompleted ? "#E8F7E8" : "#FEFAD3",
}));

const EarnItemContent = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
}));

const EarnItemTitle = styled(Box)(({ theme }) => ({
  fontSize: theme.spacing(1.5),
  fontWeight: 300,
  color: "#ABABAB",
}));

const EarnItemReward = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isCompleted",
})<{ isCompleted: boolean }>(({ theme, isCompleted }) => ({
  fontSize: theme.spacing(1.75),
  fontWeight: 500,
  color: isCompleted ? "#4BA949" : "inherit",
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
  const gaEventTracker = useAnalyticsEventTracker("ReferEarnMore");
  const [openModal, setOpenModal] = useState(false);
  const [input, setInput] = useState("");

  const handleBack = () => {
    navigate("/refer-and-earn");
  };

  useEffect(() => {
    gaEventTracker("refer_earn_more_viewed", "refer_earn_more_viewed");
    amplitude.track("refer_earn_more_viewed");
  }, []);

  const handleGoToInvite = () => {
    navigate("/refer-earn-invite");
  };

  return (
    <MainContent>
      <AppBar position="relative">
        {/* <Toolbar disableGutters>
          <IconButton
            onClick={handleBack}
            size="small"
            edge="start"
            color="inherit"
            sx={{ mr: 2, background: "#fff" }}
          >
            <ArrowLeftIcon fontSize="small" />
          </IconButton>
          Earn with Maneko
        </Toolbar> */}
        <Grid container spacing={2}>
          <Grid item xs>
            <Link to="/refer-earn-more">
              <AppBarButton fullWidth sx={{ background: "#D3FBFE" }}>
                Earn with Maneko
              </AppBarButton>
            </Link>
          </Grid>
          <Grid item xs>
            <Link to="/refer-and-earn">
              <AppBarButton fullWidth>Refer and Earn</AppBarButton>
            </Link>
          </Grid>
        </Grid>
      </AppBar>
      <EarnWithManekoTitleBox>
        <EarnWithManekoTitleImage>
          <img
            src="/assets/images/gem-token.gif"
            alt="loading..."
            width={96}
            height={96}
            style={{ marginRight: "5px" }}
          />
        </EarnWithManekoTitleImage>
        <EarnWithManekoTitleText>Earn more coins</EarnWithManekoTitleText>
        <EarnWithManekoTitleSub>Reward</EarnWithManekoTitleSub>
      </EarnWithManekoTitleBox>
      <SubTitle>Get Started</SubTitle>
      <EarnItemBox>
        <EarnItem onClick={handleGoToInvite}>
          <EarnItemIcon isCompleted={false}>
            <EarnStarIcon />
          </EarnItemIcon>
          <EarnItemContent>
            <EarnItemTitle>Invite Bonus</EarnItemTitle>
            <EarnItemReward isCompleted={false}>
              Earn up to 10% from fren
            </EarnItemReward>
          </EarnItemContent>
        </EarnItem>
      </EarnItemBox>
      <SubTitle>Social Quests</SubTitle>
      <Modal
        sx={{ position: "absolute" }}
        container={() => document.getElementById("main-app")}
        open={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <DetailModel sx={{ maxWidth: 400, width: "100%" }}>
          <div className="title">Enter Your Username Twitter</div>
          <TextField
            className="input-username"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
            placeholder="Enter invite code"
          />
          <Button className="btn-submit" fullWidth size="large">
            ENTER USERNAME
          </Button>
        </DetailModel>
      </Modal>
      <EarnItemQuestsBox>
        {quests.map((q) => (
          <EarnItem>
            <EarnItemIcon isCompleted={q.is_completed}>
              <q.icon />
            </EarnItemIcon>
            <EarnItemContent>
              <EarnItemTitle>{q.title}</EarnItemTitle>
              <EarnItemReward isCompleted={q.is_completed}>
                {q.reward}
              </EarnItemReward>
            </EarnItemContent>
          </EarnItem>
        ))}
      </EarnItemQuestsBox>
      <SubTitle>Get Started</SubTitle>
      <EarnItemBox>
        <EarnItem>
          <EarnItemIcon isCompleted={false}>
            <EarnGemIcon />
          </EarnItemIcon>
          <EarnItemContent>
            <EarnItemTitle>Reach Level 10</EarnItemTitle>
            <EarnItemReward isCompleted={false}>Earn 100 PTS</EarnItemReward>
          </EarnItemContent>
        </EarnItem>
      </EarnItemBox>
    </MainContent>
  );
};

export default Page;

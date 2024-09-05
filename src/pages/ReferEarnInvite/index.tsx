import { MainContent } from "@/components/presentation/MainContent";
import { authSelector } from "@/redux/features/auth/selectors";
import useAnalyticsEventTracker from "@/utils/useAnalyticsEventTracker";
import * as amplitude from "@amplitude/analytics-browser";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Modal,
  styled,
  TextField,
  Toolbar,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { DetailModel } from "../ReferEarnMore/ReferEarnMore.styled";

const ReferEarnInviteBox = styled(Box)(({ theme }) => ({
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
  flexDirection: "column",
}));

const ReferEarnInviteTitle = styled(Box)(({ theme }) => ({
  fontSize: theme.spacing(2),
  fontWeight: 500,
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(1),
}));
const ReferEarnInviteInfo = styled(Box)(({ theme }) => ({
  fontSize: theme.spacing(1.5),
  fontWeight: 300,
  marginBottom: theme.spacing(2),
}));
const ReferEarnInviteQuestTitle = styled(Box)(({ theme }) => ({
  fontSize: theme.spacing(1.5),
  fontWeight: 300,
  color: "#AA7A7A7",
}));
const ReferEarnInviteQuestReward = styled(Box)(({ theme }) => ({
  fontSize: theme.spacing(2),
  fontWeight: 600,
  marginBottom: theme.spacing(2),
  display: "flex",
  alignItems: "center",
}));

const SuccessTaskStyled = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  position: relative;

  .box-reward {
    position: absolute;
    bottom: 20%;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;

    .reward {
      font-size: 12px;
      font-weight: 400;
      color: #747474;
    }

    .amount {
      font-size: 16px;
      font-weight: 700;
      color: #000000;
    }
  }
`;

const Page: React.FC = () => {
  const navigate = useNavigate();
  const gaEventTracker = useAnalyticsEventTracker("ReferEarnInvite");
  const [openModal, setOpenModal] = useState(false);
  const [input, setInput] = useState("");
  const { verifierId } = useSelector(authSelector.selectSocialData) || {
    verifierId: "",
  };
  const isLoginTw = verifierId.includes("twitter");

  const handleBack = () => {
    navigate("/refer-earn-more");
  };

  useEffect(() => {
    gaEventTracker("refer_earn_invite_viewed", "refer_earn_invite_viewed");
    amplitude.track("refer_earn_invite_viewed");
  }, []);

  const onSubscribe = () => {
    if (isLoginTw) {
    } else {
      setOpenModal(true);
    }
  };

  const SuccessTask = () => (
    <SuccessTaskStyled>
      <img
        src={"/assets/images2/reward-task.png"}
        style={{ width: "100%" }}
        alt={"twitter"}
      />
      <div className="box-reward">
        <div className="amount">642 PTS</div>
        <div className="reward">Reward</div>
      </div>
    </SuccessTaskStyled>
  );

  return (
    <MainContent>
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
      <AppBar position="relative">
        <Toolbar disableGutters>
          <IconButton
            onClick={handleBack}
            size="small"
            edge="start"
            color="inherit"
            sx={{ mr: 2, background: "#fff" }}
          >
            <ArrowLeftIcon fontSize="small" />
          </IconButton>
          Invite Bonus
        </Toolbar>
      </AppBar>
      <ReferEarnInviteBox>
        {/* <SuccessTask /> */}
        <img
          src={"/assets/images2/twitter-banner.png"}
          width={295}
          height={164}
          style={{ width: "100%" }}
          alt={"twitter"}
        />
        <ReferEarnInviteTitle>
          To complete this task you need to follow us on Twitter
        </ReferEarnInviteTitle>
        <ReferEarnInviteInfo>
          After subscribing, a verification will be made, you have completed the
          task and you will receive a reward
        </ReferEarnInviteInfo>
        <ReferEarnInviteQuestTitle>
          Reward from Booster
        </ReferEarnInviteQuestTitle>
        <ReferEarnInviteQuestReward>
          <img
            src="/assets/images/gem-token.gif"
            alt="loading..."
            width={18}
            height={18}
            style={{ width: "18px", marginRight: "5px" }}
          />
          5352
        </ReferEarnInviteQuestReward>
        <Button fullWidth size="large" onClick={onSubscribe}>
          SUBSCRIBE TO TWITTER
        </Button>
      </ReferEarnInviteBox>
    </MainContent>
  );
};

export default Page;

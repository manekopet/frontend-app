import * as nftPetApi from "@/apis/nft-pet";
import * as taskApi from "@/apis/task";
import { ReactComponent as EarnCheckIcon } from "@/assets/svg/earn-check.svg";
import { ReactComponent as EarnDiamondIcon } from "@/assets/svg/earn-diamond.svg";
import { ReactComponent as EarnHeartIcon } from "@/assets/svg/earn-heart.svg";
import Loader from "@/components/Loader";
import { MainContent } from "@/components/presentation/MainContent";
import { useDispatch, useSelector } from "@/hooks/redux";
import appSlice from "@/redux/features/app/slice";
import { petSelectors } from "@/redux/features/pet/selectors";
import petSlice from "@/redux/features/pet/slice";
import { getErrorMessage } from "@/types/error";
import { Pet, PetWithState } from "@/types/pet";
import { Task } from "@/types/task";
import useAnalyticsEventTracker from "@/utils/useAnalyticsEventTracker";
import * as amplitude from "@amplitude/analytics-browser";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import {
  AppBar,
  Box,
  Button,
  Grid,
  IconButton,
  Link,
  Modal,
  TextField,
  Toolbar,
  styled,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const quests = [
  {
    createdAt: "2024-04-16T08:34:08.713Z",
    title: 52796,
    mgem_reward: 33583,
    point_reward: 86989,
    checked: false,
    id: "1",
  },
  {
    createdAt: "2024-04-15T19:22:15.921Z",
    title: 86666,
    mgem_reward: 45952,
    point_reward: 55520,
    checked: false,
    id: "2",
  },
  {
    createdAt: "2024-04-16T03:31:44.645Z",
    title: 12194,
    mgem_reward: 79603,
    point_reward: 98795,
    checked: true,
    id: "3",
  },
  {
    createdAt: "2024-04-15T13:54:32.682Z",
    title: 3958,
    mgem_reward: 82410,
    point_reward: 14924,
    checked: true,
    id: "4",
  },
  {
    createdAt: "2024-04-16T07:51:21.438Z",
    title: 57343,
    mgem_reward: 73436,
    point_reward: 87780,
    checked: false,
    id: "5",
  },
  {
    createdAt: "2024-04-15T20:29:39.070Z",
    title: 87784,
    mgem_reward: 46375,
    point_reward: 82055,
    checked: true,
    id: "6",
  },
  {
    createdAt: "2024-04-16T06:27:43.182Z",
    title: 99795,
    mgem_reward: 77393,
    point_reward: 63076,
    checked: false,
    id: "7",
  },
  {
    createdAt: "2024-04-16T11:23:13.102Z",
    title: 85123,
    mgem_reward: 9401,
    point_reward: 48787,
    checked: true,
    id: "8",
  },
  {
    createdAt: "2024-04-15T18:32:12.798Z",
    title: 423,
    mgem_reward: 68137,
    point_reward: 82683,
    checked: true,
    id: "9",
  },
  {
    createdAt: "2024-04-16T07:25:18.609Z",
    title: 63724,
    mgem_reward: 79007,
    point_reward: 43574,
    checked: true,
    id: "10",
  },
];

const socialQuests = [
  {
    createdAt: "2024-04-16T08:34:08.713Z",
    title: "Follow Twitter",
    mgem_reward: 33583,
    point_reward: 1000,
    checked: false,
    id: "11",
  },
  {
    createdAt: "2024-04-15T19:22:15.921Z",
    title: "Original Tweet",
    mgem_reward: 45952,
    point_reward: 1000,
    checked: true,
    id: "12",
  },
];

const socialQuestData: Record<number, Record<string, any>> = {
  10001: {
    title: "Enter your twitter Username",
    placeholder: "Twitter username",
    submit: "SUBMIT",
  },
  "12": {
    title: "Enter your twitter Username",
    placeholder: "Twitter ID",
    submit: "SUBMIT",
  },
};

const SubTitle = styled(Box)(({ theme }) => ({
  fontSize: theme.spacing(2.5),
  marginBottom: theme.spacing(1),
}));

const DailyRewardTitleBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(4),
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
}));

const DailyRewardTitleImage = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(2),
}));

const DailyRewardTitleText = styled(Box)(({ theme }) => ({
  fontSize: theme.spacing(2.5),
  fontWeight: 600,
}));

const DailyRewardTitleSub = styled(Box)(({ theme }) => ({
  fontSize: theme.spacing(1.5),
  fontWeight: 300,
}));

const DailyRewardItemBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  background: "#fff",
  borderRadius: "10px",
  border: "1px solid rgba(13, 22, 21, 1)",
  boxShadow: "1px 1px 0px 0px rgba(13, 22, 21, 1)",
  marginBottom: theme.spacing(2.5),
}));

const DailyRewardItemQuestsBox = styled(DailyRewardItemBox)(
  ({ theme }) => ({})
);

const DailyRewardItem = styled(Box)(({ theme }) => ({
  display: "flex",
  padding: "12px",
  cursor: "pointer",
}));

const DailyRewardDayItem = styled(Box)(({ theme }) => ({
  display: "flex",
  cursor: "pointer",
  flexDirection: "column",
  padding: theme.spacing(2),
  boxShadow: "1px 1px 0px 0px #0D1615",
  borderRadius: "10px",
  border: "1px solid #0D1615",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing(0.5),
}));

const DailyRewardItemIcon = styled(Box, {
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
  overflow: "hidden",
}));

const DailyRewardItemContent = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
}));

const DailyRewardItemTitle = styled(Box)(({ theme }) => ({
  fontSize: theme.spacing(1.5),
  fontWeight: 300,
  color: "#ABABAB",
}));

const DailyRewardItemReward = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isCompleted",
})<{ isCompleted: boolean }>(({ theme, isCompleted }) => ({
  fontSize: theme.spacing(1.75),
  fontWeight: 500,
  color: isCompleted ? "#4BA949" : "inherit",
}));

export const DetailModel = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  background: #f7e8f6 !important;
  border-radius: 5px;
  box-shadow: 24px;
  padding: 24px;

  .input-username {
    width: 100%;
  }
  .btn-submit {
    margin-top: 24px;
  }

  .title {
    font-size: 20px;
  }

  .subtitle {
    font-size: 16px;
    margin-bottom: 24px;
    word-break: break-all;

    a {
      color: #0d1615;
    }
  }
`;

const Page: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const gaEventTracker = useAnalyticsEventTracker("DailyRewards");
  const [openModal, setOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [socialTasks, setSocialTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Record<number, Task>>(
    {}
  );
  const [nextDailyTaskConfigCode, setNextDailyTaskConfigCode] =
    useState<number>(0);
  const [socialTask, setSocialTask] = useState<Task | null>(null);
  const activePet = useSelector(petSelectors.selectActivePet);

  const handleBack = () => {
    navigate("/refer-and-earn");
  };

  const fetchTasks = async () => {
    setIsLoading(true);
    const tasks = await taskApi.taskAll();
    setIsLoading(false);
    const socialTasks = tasks.filter((t) => t.SocialLink !== "");
    const dailyTasks = tasks
      .filter((t) => t.SocialLink === "")
      .sort((a, b) => a.TaskConfigCode - b.TaskConfigCode);

    setTasks(() => dailyTasks);
    setSocialTasks(socialTasks);

    const completedTasks = await taskApi.taskComplete();
    const completedTasksMap: Record<number, Task> = {};
    for (const t of completedTasks) {
      completedTasksMap[t.TaskConfigCode] = t;
    }
    const sortedTasks = completedTasks
      .filter((t) => t.Provider === "")
      .sort((a, b) => b.TaskConfigCode - a.TaskConfigCode);
    setCompletedTasks(completedTasksMap);
    if (sortedTasks.length > 0) {
      setNextDailyTaskConfigCode(sortedTasks[0].TaskConfigCode + 1);
    } else {
      setNextDailyTaskConfigCode(dailyTasks[0].TaskConfigCode);
    }
  };

  const fetchPets = async () => {
    try {
      // Get list my pet
      const pets: Pet[] = await nftPetApi.getMyPets();
      if (pets.length > 0) {
        dispatch(petSlice.actions.setPets({ pets }));

        // Get pet active
        const pet: PetWithState = await nftPetApi.getMyPetFeed(
          activePet ? activePet.pet?.nftId : pets[0].nftId
        );
        dispatch(petSlice.actions.activePet({ pet }));
      }
    } catch (e: any) {
      console.log("Not found NFTs.");
    }
  };

  const handleClickSocialTask = (t: Task) => {
    return () => {
      if (!completedTasks[t.TaskConfigCode]) {
        setSocialTask(t);
        setOpenModal(true);
      }
    };
  };

  const handleSubmitSocialTask = async () => {
    if (socialTask) {
      try {
        if (input.trim() === "") {
          toast.error("Please enter twitter username");
          return;
        }
        setIsLoading(true);
        const taskFunc =
          socialTask.TaskConfigCode === 10001
            ? taskApi.taskSocialTwitter
            : taskApi.taskSocialTwitterRetweet;
        const { status, mgem } = await taskFunc(input);
        if (status === 1) {
          setOpenModal(false);
          dispatch(
            appSlice.actions.showRewardModal({
              points: mgem,
              symbol: "MGEM",
            })
          );
          fetchTasks();
        } else {
          toast.error(
            "We can't retrieve your tasks right now. Please try again."
          );
        }
      } catch (e) {
        toast.error(
          "We can't retrieve your tasks right now. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleClickDailyTask = (t: Task) => {
    return async () => {
      if (!completedTasks[t.TaskConfigCode]) {
        if (activePet) {
          try {
            setIsLoading(true);
            const { status, mgem } = await taskApi.taskCheckDaily(
              activePet.pet.nftId
            );
            if (status === 1) {
              dispatch(
                appSlice.actions.showRewardModal({
                  points: mgem,
                  symbol: "MGEM",
                })
              );
              fetchTasks();
            } else {
              toast.error(
                "We can't retrieve your tasks right now. Please try again."
              );
            }
          } catch (e) {
            toast.error(getErrorMessage(e));
          } finally {
            setIsLoading(false);
          }
        }
      }
    };
  };

  useEffect(() => {
    gaEventTracker("daily_rewards_viewed", "daily_rewards_viewed");
    amplitude.track("daily_rewards_viewed");
    if (!activePet) {
      fetchPets();
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <MainContent>
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
          Daily Reward
        </Toolbar>
      </AppBar>
      <DailyRewardTitleBox>
        <DailyRewardTitleImage>
          <img
            src="/assets/images2/daily-rewards-photo.jpg"
            alt="loading..."
            height={96}
            style={{ marginRight: "5px" }}
          />
        </DailyRewardTitleImage>
        <DailyRewardTitleText>Daily rewards</DailyRewardTitleText>
        <DailyRewardTitleSub>Reward</DailyRewardTitleSub>
      </DailyRewardTitleBox>

      {socialTasks.length > 0 && <SubTitle>Social Quests</SubTitle>}
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
          <Box className="title">{socialTask?.Description}</Box>
          <Box className="subtitle">
            Click here{" "}
            <Link
              sx={{ fontWeight: "500", textDecoration: "underline" }}
              href={socialTask?.SocialLink}
              target="_blank"
            >
              Twitter
            </Link>
          </Box>
          <TextField
            className="input-username"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
            placeholder={"Twitter Username"}
          />
          <Button
            className="btn-submit"
            fullWidth
            size="large"
            onClick={handleSubmitSocialTask}
          >
            SUBMIT
          </Button>
        </DetailModel>
      </Modal>
      {socialTasks.length > 0 && (
        <DailyRewardItemQuestsBox>
          {socialTasks.map((t, idx) => (
            <DailyRewardItem
              key={`social-${idx}`}
              onClick={handleClickSocialTask(t)}
            >
              <DailyRewardItemIcon
                isCompleted={!!completedTasks[t.TaskConfigCode]}
              >
                {completedTasks[t.TaskConfigCode] ? (
                  <EarnCheckIcon />
                ) : idx % 2 === 0 ? (
                  <EarnHeartIcon />
                ) : (
                  <EarnDiamondIcon />
                )}
              </DailyRewardItemIcon>
              <DailyRewardItemContent>
                <DailyRewardItemTitle>{t.Description}</DailyRewardItemTitle>
                <DailyRewardItemReward
                  isCompleted={!!completedTasks[t.TaskConfigCode]}
                >
                  {`Earn ${t.MgemReward} MGEM`}
                </DailyRewardItemReward>
              </DailyRewardItemContent>
            </DailyRewardItem>
          ))}
        </DailyRewardItemQuestsBox>
      )}

      {tasks.length > 0 && (
        <DailyRewardItemQuestsBox>
          <Grid container spacing={2} sx={{ p: 2 }}>
            {tasks.map((t, idx) => (
              <Grid item xs={3} key={`daily-${idx}`}>
                <DailyRewardDayItem
                  onClick={
                    nextDailyTaskConfigCode > 0 &&
                    nextDailyTaskConfigCode === t.TaskConfigCode
                      ? handleClickDailyTask(t)
                      : () => {}
                  }
                >
                  <DailyRewardItemIcon
                    sx={{ ml: "6px" }}
                    isCompleted={!!completedTasks[t.TaskConfigCode]}
                  >
                    {completedTasks[t.TaskConfigCode] ? (
                      <EarnCheckIcon />
                    ) : (
                      <img
                        src="assets/images/gem-token.gif"
                        style={{ width: "80%" }}
                      />
                    )}
                  </DailyRewardItemIcon>
                  <DailyRewardItemContent>
                    <DailyRewardItemTitle>{t.Description}</DailyRewardItemTitle>
                    {/* <DailyRewardItemReward isCompleted={q.checked}>
                    {`Earn ${q.point_reward} PTS`}
                  </DailyRewardItemReward> */}
                  </DailyRewardItemContent>
                </DailyRewardDayItem>
              </Grid>
            ))}
          </Grid>
        </DailyRewardItemQuestsBox>
      )}
      {isLoading && <Loader sx={{ background: "rgba(0,0,0,.2)" }} />}
    </MainContent>
  );
};

export default Page;

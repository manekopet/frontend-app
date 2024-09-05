import * as gameApi from "@/apis/game";
import { MainContent } from "@/components/presentation/MainContent";
import Mention from "@/components/presentation/Mention";
import { useSelector } from "@/hooks/redux";
import { petSelectors } from "@/redux/features/pet/selectors";
import { PetWithState } from "@/types/pet";
import * as amplitude from "@amplitude/analytics-browser";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import {
  AppBar,
  Box,
  BoxProps,
  Grid,
  IconButton,
  styled,
  Toolbar,
} from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface AchievementProps extends BoxProps {
  selected?: boolean;
}
const Achievement = styled(Box, {
  shouldForwardProp: (prop) => prop !== "selected",
})<AchievementProps>(({ selected }) => ({
  background: selected ? "#FEF2D3" : "#fff",
  borderRadius: "10px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  border: "1px solid rgba(13, 22, 21, 1)",
  boxShadow: "1px 1px 0px 0px rgba(13, 22, 21, 1)",
  flexDirection: "column",
  width: "100%",
  padding: "20px 0",

  "& img": {
    marginBottom: "15px",
  },
}));

interface AchievementItem {
  image: string;
  text: string;
  description: string;
}

const Page: React.FC = () => {
  const navigate = useNavigate();
  const activePet = useSelector<PetWithState | null>(
    petSelectors.selectActivePet
  );
  const [achievement, setAchievement] = useState<AchievementItem | null>(null);
  const [achievements, setAchievements] = useState<AchievementItem[]>([
    {
      image: "assets/images/ar-item-1.png",
      text: `-`,
      description: "Number of days your pet exists",
    },
    {
      image: "assets/images/ar-item-2.png",
      text: `-`,
      description: "Number of attacks",
    },
    {
      image: "assets/images/ar-item-3.png",
      text: `-`,
      description: "Number of community diamonds you received",
    },
    {
      image: "assets/images/ar-item-4.png",
      text: `-`,
      description: "Number of kills of other players",
    },
    {
      image: "assets/images/ar-item-5.png",
      text: `-`,
      description: "Number of times you revive your pet",
    },
    {
      image: "assets/images/ar-item-6.png",
      text: `-`,
      description: "Number of times you feed your pet",
    },
  ]);

  useEffect(() => {
    amplitude.track("view-achievement");
    const getAchievements = async () => {
      try {
        const result: any = await gameApi.getAchievement(activePet?.pet?.nftId);
        const now = moment();
        const timePetBorn = moment(result?.data?.timePetBorn);
        const diffInDays = now.diff(timePetBorn, "days");
        const achievementsTemp: AchievementItem[] = [
          {
            image: "assets/images/ar-item-1.png",
            text: `${diffInDays === 0 ? 1 : diffInDays}d`,
            description: "Number of days your pet exists",
          },
          {
            image: "assets/images/ar-item-2.png",
            text: result?.data.attacks || 0,
            description: "Number of attacks",
          },
          {
            image: "assets/images/ar-item-3.png",
            text: result?.data.Gems || 0,
            description: "Number of community diamonds you received",
          },
          {
            image: "assets/images/ar-item-4.png",
            text: result?.data.stars || 0,
            description: "Number of kills of other players",
          },
          {
            image: "assets/images/ar-item-5.png",
            text: result?.data.revived || 0,
            description: "Number of times you revive your pet",
          },
          {
            image: "assets/images/ar-item-6.png",
            text: result?.data.feed || 0,
            description: "Number of times you feed your pet",
          },
        ];
        setAchievements(achievementsTemp);
        setAchievement(achievementsTemp[0]);
      } catch (e: any) {}
    };

    getAchievements();
  }, []);

  const handleBack = () => {
    navigate("/my-pet");
  };

  const handleClickAchievement = (a: AchievementItem) => {
    return () => {
      setAchievement(a);
    };
  };

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
          Achievements
        </Toolbar>
      </AppBar>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {achievements.map((a: AchievementItem, idx: any) => (
          <Grid key={`achievement-${idx}`} item xs={4}>
            <Achievement
              onClick={handleClickAchievement(a)}
              selected={achievement?.image === a.image}
            >
              <img src={a.image} alt={a.text} style={{ height: "50px" }} />
              {a.text}
            </Achievement>
          </Grid>
        ))}
      </Grid>
      {achievement && (
        <Mention
          sx={{ background: "#fff" }}
          withIcon={true}
          title={achievement.description}
        />
      )}
    </MainContent>
  );
};

export default Page;

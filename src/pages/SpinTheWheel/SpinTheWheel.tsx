import * as gameApi from "@/apis/game";
import NextSpinTime from "@/components/NextSpinTime";
import { Wheel } from "@/components/roulette/Wheel";
import Volume from "@/components/Volume";
import { useSelector } from "@/hooks/redux";
import useAudios from "@/hooks/useAudios";
import { appSelectors } from "@/redux/features/app/selectors";
import { syncActivePetPointsAsync } from "@/redux/features/auth/saga";
import { petSelectors } from "@/redux/features/pet/selectors";
import { getErrorMessage } from "@/types/error";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";

import { MainContent } from "@/components/presentation/MainContent";
import appSlice from "@/redux/features/app/slice";
import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  styled,
  Toolbar,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ContentBorderWrapper from "../../components/presentation/ContentBorderWrapper";

const Content = styled(Box)(() => ({
  padding: "20px",
}));

const WheelWrapper = styled(Box)(() => ({
  position: "relative",
  width: "100%",
  margin: "0 auto",
  padding: "40px 0 20px 0",
  overflow: "hidden",

  "& > div:first-of-type": {
    // width: "300px",
    // height: "300px",
    margin: "0 auto",
    // transform: "rotate(-45deg)",
  },
}));

const NextSpinTimeWrapper = styled(Box)(() => ({
  position: "absolute",
  top: "0",
  left: "0",
}));

export const VolumeWrapper = styled(Box)(() => ({
  position: "absolute",
  top: "0",
  right: "0",
}));

const Page: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [mustSpin, setMustSpin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [prizeMessage, setPrizeMessage] = useState("");
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [nextSpinTime, setNextSpinTime] = useState<number>(0);
  const activePet = useSelector(petSelectors.selectActivePet);
  const spinBoardItems = useSelector(appSelectors.selectSpinBoard);
  const mute = useSelector(appSelectors.selectMute);
  const { spinAudio, spinNothing, spinWin } = useAudios();
  const spinRewards = spinBoardItems
    ? spinBoardItems.map((item) => ({
        option: item.message,
      }))
    : [];

  spinAudio.current.loop = true;

  const handleSpin = async () => {
    if (!mustSpin) {
      setLoading(true);
      try {
        if (activePet && spinBoardItems) {
          const { message, rewardIndex } = await gameApi.spin(
            activePet?.pet?.nftId
          );
          const prizeNumber = spinBoardItems.findIndex(
            (item) => item.indexId === rewardIndex
          );
          setPrizeNumber(prizeNumber);
          setPrizeMessage(message);
          setMustSpin(true);
          if (!mute) {
            spinAudio.current.play();
          }
        }
      } catch (e: any) {
        const message = getErrorMessage(e);
        toast(message || "Spin failed");
        setLoading(false);
      }
    }
  };

  const handleStopSpin = () => {
    toast(prizeMessage);
    setTimeout(() => {
      setLoading(false);
      spinAudio.current.pause();
      if (spinBoardItems !== undefined) {
        if (spinBoardItems[prizeNumber].indexId === 1) {
          if (!mute) {
            spinNothing.current.play();
          }
        } else {
          if (!mute) {
            spinWin.current.play();
          }

          let points = 0;
          try {
            points = parseInt(
              spinBoardItems[prizeNumber].message.replace("points", "").trim()
            );
          } catch (e) {
            console.log("parse int reward failed", e);
          }

          if (points > 0) {
            dispatch(
              appSlice.actions.showRewardModal({
                points: points,
                symbol: "PTS",
              })
            );
          }
        }
      }

      setPrizeMessage("");
      setMustSpin(false);
      dispatch(syncActivePetPointsAsync());
    }, 1000);
  };

  const handleBack = () => {
    navigate("/arcades");
  };

  useEffect(() => {
    const nextSpinCheck = async () => {
      if (activePet) {
        try {
          const { diff } = await gameApi.spinCheck(activePet.pet?.nftId);
          setNextSpinTime(diff);
        } catch (e: any) {
          console.log(e);
        }
      }
    };

    nextSpinCheck();

    const copySpinAudio = spinAudio.current;
    const copySpinNothingAudio = spinNothing.current;
    const copySpinWinAudio = spinWin.current;

    return () => {
      copySpinAudio.pause();
      copySpinNothingAudio.pause();
      copySpinWinAudio.pause();
    };
  }, [activePet, spinAudio, spinNothing, spinWin]);

  if (spinRewards.length === 0) {
    return null;
  }

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
          Spin The Wheel
        </Toolbar>
      </AppBar>
      <ContentBorderWrapper sx={{ p: "20px" }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {spinRewards && (
              <WheelWrapper>
                <Wheel
                  mustStartSpinning={mustSpin}
                  prizeNumber={prizeNumber}
                  data={spinRewards}
                  backgroundColors={["#FEF2D3", "#D3FBFE", "#FED3E7"]}
                  outerBorderWidth={2}
                  radiusLineWidth={2}
                  innerRadius={10}
                  innerBorderWidth={2}
                  onStopSpinning={handleStopSpin}
                />

                {nextSpinTime !== 0 && (
                  <NextSpinTimeWrapper>
                    <NextSpinTime diff={nextSpinTime} />
                  </NextSpinTimeWrapper>
                )}
                <VolumeWrapper>
                  <Volume />
                </VolumeWrapper>
              </WheelWrapper>
            )}
          </Grid>
          <Grid item xs={12}>
            <Button
              onClick={handleSpin}
              disabled={loading || activePet == null}
              size="large"
              fullWidth
              color="primary"
            >
              {loading ? (
                <CircularProgress color="inherit" size={24} />
              ) : (
                "SPIN"
              )}
            </Button>
          </Grid>
        </Grid>
      </ContentBorderWrapper>
    </MainContent>
  );
};

export default Page;

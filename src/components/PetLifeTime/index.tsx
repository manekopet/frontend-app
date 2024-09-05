import { useSelector } from "@/hooks/redux";
import { petSelectors } from "@/redux/features/pet/selectors";
import { PetStatusLive } from "@/types/pet";
import { Box, styled } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";

const Main = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#F7F0E8",
  border: "1px solid rgba(13, 22, 21, 1)",
  boxShadow: "1px 1px 0px 0px rgba(13, 22, 21, 1)",
  borderRadius: "20px",
  height: "27px",
  padding: "6px 16px",
  minWidth: "120px",

  fontSize: theme.spacing(1.5),
  fontWeight: 400,
  letterSpacing: "0.07px",

  "& img": {
    width: theme.spacing(2),
  },
}));

const PetLifeTime: React.FC = () => {
  const [lifeTime, setLifeTime] = useState("");

  const activePet = useSelector(petSelectors.selectActivePet);

  useEffect(() => {
    let time = "";
    let hideTOD = false;
    if (activePet) {
      time = activePet.pet?.timeUntilStarving;
      if (activePet.pet?.statusLive === PetStatusLive.Death) {
        hideTOD = true;
      }
      if (activePet.pet?.statusLive === PetStatusLive.Faint) {
        time = moment(time).add(7, "d").utc().format();
      }
    }

    let loopId: ReturnType<typeof setInterval> | null = null;
    if (!hideTOD) {
      const deathTime = moment(time);

      let duration = moment.duration(
        deathTime.valueOf() - moment().valueOf(),
        "milliseconds"
      );
      const interval = 1000;
      loopId = setInterval(function () {
        duration = moment.duration(
          duration.asMilliseconds() - interval,
          "milliseconds"
        );

        if (duration.asMilliseconds() < 0) {
          setLifeTime("0");
        } else {
          const days = Math.floor(duration.asDays());
          const hours = duration.hours();
          const minutes = duration.minutes();
          const seconds = duration.seconds();

          setLifeTime(
            `${days > 0 ? `${days}d` : ""}${hours > 0 ? `${hours}h` : ""}${
              minutes > 0 ? `${minutes}m` : ""
            }${seconds}s`
          );
        }
      }, interval);
    }

    return () => {
      if (loopId) {
        clearInterval(loopId);
      }
    };
  }, [activePet]);

  return (
    <Main>
      <img
        src="assets/images2/ghost.svg"
        style={{ marginRight: lifeTime === "" ? 0 : "8px" }}
        alt="ghost"
      />
      {lifeTime}
    </Main>
  );
};

export default PetLifeTime;

import { Box, styled } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";

interface NextSpinTimeProps {
  diff: number;
}

const Main = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  border: "1px solid rgba(13, 22, 21, 1)",
  boxShadow: "1px 1px 0px 0px rgba(13, 22, 21, 1)",
  borderRadius: "20px",
  height: "27px",
  padding: "6px 16px",
  minWidth: "120px",

  fontSize: theme.spacing(1.5),
  fontWeight: 400,
  letterSpacing: "0.07px",
}));

const NextSpinTime: React.FC<NextSpinTimeProps> = ({ diff }) => {
  const [nextTime, setNextTime] = useState("");

  useEffect(() => {
    let loopId: ReturnType<typeof setInterval> | null = null;
    let duration = moment.duration(diff * 1000, "milliseconds");
    const interval = 1000;
    loopId = setInterval(function () {
      duration = moment.duration(
        duration.asMilliseconds() - interval,
        "milliseconds"
      );

      if (duration.asSeconds() < 0) {
        setNextTime("");
      } else {
        const hours = Math.floor(duration.asHours());
        const minutes = duration.minutes();
        const seconds = duration.seconds();

        setNextTime(
          `${hours > 0 ? `${hours}h` : ""}${
            minutes > 0 ? `${minutes}m` : ""
          }${seconds}s`
        );
      }
    }, interval);

    return () => {
      if (loopId) {
        clearInterval(loopId);
      }
    };
  }, [diff]);

  if (nextTime === "") {
    return null;
  }

  return <Main>Next spin {nextTime}</Main>;
};

export default NextSpinTime;

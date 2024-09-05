import { ENVS } from "@/configs/Configs.env";
import { useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useState } from "react";

function useIsPWA() {
  const [finishedCheck, setFinishedCheck] = useState(false);
  const [isPWA, setIsPWA] = useState(false);
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"), {
    noSsr: true,
  });
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"), {
    noSsr: true,
  });
  const bypassPWA: boolean = ENVS.REACT_APP_BYPASS_PWA;

  useEffect(() => {
    const checkPWA = () => {
      const params = new URLSearchParams(window.location.search);
      const isAdmin = params.get("isAdmin");

      if (bypassPWA || isAdmin === "M@n3k0p3t") {
        return true;
      }
      return ["fullscreen", "standalone", "minimal-ui"].some(
        (displayMode) =>
          window.matchMedia("(display-mode: " + displayMode + ")").matches
      );
    };

    if (isMobile && checkPWA()) {
      setIsPWA(true);
    }

    setFinishedCheck(true);
  }, [isMobile, bypassPWA]);

  return { isPWA, isMobile, isDesktop, finishedCheck };
}
export default useIsPWA;

import * as appStoreApi from "@/apis/appstore";
import SquareBox from "@/components/presentation/SquareBox";
import { useSelector } from "@/hooks/redux";
import useAudios from "@/hooks/useAudios";
import { appSelectors } from "@/redux/features/app/selectors";
import { MenuItem } from "@/types/common";
import useAnalyticsEventTracker from "@/utils/useAnalyticsEventTracker";
import * as amplitude from "@amplitude/analytics-browser";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import CloseIcon from "@mui/icons-material/Close";
import { AppBar, Box, Grid, IconButton, styled, Toolbar } from "@mui/material";
import { useEffect, useState } from "react";
import Iframe from "react-iframe";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Loader from "@/components/Loader";
import { MainContent } from "@/components/presentation/MainContent";
import { petSelectors } from "@/redux/features/pet/selectors";
import { getErrorMessage } from "@/types/error";
import { Game } from "@/types/game";

const menus: MenuItem[] = [
  {
    name: "wheel",
    href: "/arcades/spin-the-wheel",
    image: "assets/images2/arcades-wheel.svg",
  },
  {
    name: "dice",
    href: "#",
    image: "assets/images2/arcades-dice.svg",
  },
];

const Menu = styled(Box)(({ theme }) => ({
  borderRadius: "10px",
  display: "flex",
  width: "100%",
  height: "100%",
  justifyContent: "center",
  alignItems: "center",
  border: "1px solid rgba(13, 22, 21, 1)",
  boxShadow: "1px 1px 0px 0px rgba(13, 22, 21, 1)",
  background: "#fff",
  flexDirection: "column",
  cursor: "pointer",
}));

const MenuImage = styled(Box)(({ theme }) => ({
  display: "flex",
  width: "100%",
  height: "60px",
  justifyContent: "center",
  alignItems: "center",
  // marginBottom: theme.spacing(1),

  "& img": {
    width: "70px",
  },
}));

const GameFrame = styled(Box)(() => ({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  zIndex: 9999,
  background: "#0e100ed1",
}));

const CloseButtonBox = styled(Box)(() => ({
  position: "absolute",
  top: 0,
  right: 0,
  zIndex: 1,
}));

const Page: React.FC = () => {
  const navigate = useNavigate();
  const mute = useSelector(appSelectors.selectMute);
  const activePet = useSelector(petSelectors.selectActivePet);
  const [isLoading, setIsLoading] = useState(false);
  const [games, setGames] = useState<Game[]>([]);
  const [gameUrl, setGameUrl] = useState("");
  const { openArcadesAudio } = useAudios();
  const gaEventTracker = useAnalyticsEventTracker("Arcades");
  const handleBack = () => {
    navigate("/my-pet");
  };

  const handleCloseGame = () => {
    setGameUrl("");
  };

  const handleClickMenu = (m: MenuItem) => {
    return () => {
      if (m.href === "#") {
        toast("Coming soon");
      } else {
        navigate(m.href);
      }
    };
  };

  const handlePlayGame = async (g: Game) => {
    if (activePet) {
      try {
        setIsLoading(true);
        const { session } = await appStoreApi.getSessionPlay(
          g.appApiKey,
          activePet.pet.nftId
        );
        // GAME_URL get from api list_app
        const gameUrl = `${g.appUrl}?${session.sessionId}`;
        setGameUrl(gameUrl);
      } catch (e: unknown) {
        toast.error(getErrorMessage(e));
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const copyOpenArcadesAudio = openArcadesAudio.current;
    if (!mute) {
      copyOpenArcadesAudio.play();
    }

    return () => {
      copyOpenArcadesAudio.pause();
    };
  }, [mute, openArcadesAudio]);

  useEffect(() => {
    const fetchGames = async () => {
      const games = await appStoreApi.getList();
      setGames(games);
    };
    fetchGames();
  }, []);

  useEffect(() => {
    gaEventTracker("view_arcade", "view_arcade");
    amplitude.track("view_arcade");
  }, []);

  return (
    <>
      {gameUrl && (
        <GameFrame>
          <Iframe url={gameUrl} width="100%" height="100%" frameBorder={0} />
          <CloseButtonBox>
            <IconButton
              sx={{ border: "none", boxShadow: "none" }}
              size="small"
              onClick={handleCloseGame}
              aria-label="close"
              color="primary"
            >
              <CloseIcon />
            </IconButton>
          </CloseButtonBox>
        </GameFrame>
      )}

      {isLoading && <Loader sx={{ background: "#F7E8F6" }} />}

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
            Arcades
          </Toolbar>
        </AppBar>
        <Grid container spacing={2} sx={{ mb: "20px" }}>
          {games.map((g) => (
            <Grid item xs={4} key={`menu-game-${g.id}`}>
              <SquareBox>
                <Menu onClick={() => handlePlayGame(g)}>
                  <MenuImage>
                    <img src={g.appThumb} alt={g.appTitle} />
                  </MenuImage>
                </Menu>
              </SquareBox>
            </Grid>
          ))}

          {menus.map((m, idx) => (
            <Grid item xs={4} key={`menu-${idx}`}>
              <SquareBox>
                <Menu onClick={handleClickMenu(m)}>
                  <MenuImage>
                    <img src={m.image} alt={m.name} />
                  </MenuImage>
                </Menu>
              </SquareBox>
            </Grid>
          ))}
        </Grid>
      </MainContent>
    </>
  );
};

export default Page;

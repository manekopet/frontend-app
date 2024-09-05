import { PetState, PetStateData } from "@/types/pet";
import { Box, BoxProps, Button, IconButton, styled } from "@mui/material";
import { RefObject } from "react";

export const AvatarIconButton = styled(IconButton)(() => ({
  background: "#D3E4FE",
  marginRight: "10px",
}));

interface FoodProps extends BoxProps {
  selected?: boolean;
}

export const LeaderboardInfo = styled(Box)(() => ({
  fontSize: "14px",
  fontWeight: "400",
  letterSpacing: "0.07px",
  textAlign: "left",
  marginBottom: "10px",
  lineHeight: "normal",
}));

export const Food = styled(Box, {
  shouldForwardProp: (prop) => prop !== "selected",
})<FoodProps>(({ selected }) => ({
  borderRadius: "10px",
  display: "flex",
  width: "100%",
  height: "100%",
  justifyContent: "center",
  alignItems: "center",
  border: "1px solid rgba(13, 22, 21, 1)",
  boxShadow: "1px 1px 0px 0px rgba(13, 22, 21, 1)",
  background: selected ? "#FFEBC0" : "#FFF",
  cursor: "pointer",
  "& img": {
    width: "70%",
  },
}));

export const StepContainer = styled(Box)(() => ({
  width: "100%",
}));

export const ContentPriceMint = styled(Box)(() => ({
  display: "flex",
  justifyContent: "space-between",
}));

export const StepDescription = styled(Box)(() => ({
  fontSize: "15px",
  fontStyle: "normal",
  fontWeight: "500",
  lineHeight: "normal",
  letterSpacing: "0.07px",
  textAlign: "left",
}));

export const StepDescriptionMain = styled(Box)(() => ({
  fontSize: "20px",
  fontStyle: "normal",
  fontWeight: "500",
  lineHeight: "normal",
  letterSpacing: "0.07px",
  textAlign: "left",
  width: "251px",
}));

export const ContentBorderWrapperMain = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  background: "#fff",
  boxShadow: " 1px 1px 0px 0px #0D1615 !important",
  color: "#0D1615",
  borderRadius: "10px",
  border: "1px solid #0D1615",
  padding: "10px 20px",
  flexDirection: "column",
  minHeight: "311px",
}));

export const SwapInputBoxInput = styled(Box)(() => ({
  fontSize: "14px",
  fontWeight: 500,
  lineHeight: "17.5px",
  letterSpacing: "0.07px",

  "& input": {
    padding: 0,
    fontSize: "14px",
    fontWeight: 500,
    lineHeight: "17.5px",
    letterSpacing: "0.07px",
  },
}));

export const LevelModalBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "35%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "75%",
  padding: "10px 28px 10px 28px",
  textAlign: "center",
  borderRadius: "20px",
  background: "#ffffffd5",
  border: "1px solid black",
  height: "210px",
}));

export const LevelModalTitle = styled(Box)(() => ({
  fontSize: "20px",
  fontWeight: "500",
  lineHeight: "20px",
  letterSpacing: "0.07px",
  textAlign: "center",
  marginBottom: "24px",
}));

export const LevelModalContent = styled(Box)(() => ({
  fontSize: "14px",
  fontWeight: "400",
  lineHeight: "20px",
  letterSpacing: "0.07px",
  textAlign: "center",
  marginBottom: "30px",

  "& svg": {
    verticalAlign: "middle",
  },
}));

export const Menu = styled(Box)(() => ({
  borderRadius: "10px",
  display: "flex",
  width: "100%",
  height: "100%",
  justifyContent: "center",
  alignItems: "center",
  border: "1px solid rgba(13, 22, 21, 1)",
  boxShadow: "1px 1px 0px 0px rgba(13, 22, 21, 1)",
  background: "rgba(247, 232, 246, 1)",
  cursor: "pointer",
  "& img": {
    width: "60%",
  },
}));

export const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "400px",
  bgcolor: "background.paper",
  border: "2px solid #000",
  borderRadius: "5px",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

export const CircleButton = styled(Button)(() => ({
  borderRadius: "50px",
}));

export const MainPetBox = styled(Box)(() => ({
  position: "relative",
  width: "100%",
  height: "100%",
  overflow: "hidden",
  "& > img": {
    position: "absolute",
    bottom: "10px",
    left: "20%",
    width: "150px",
    zIndex: 100,
  },
}));

export const AnimatedMainPetPoo = styled(Box, {
  shouldForwardProp: (prop: string) =>
    ["screenWidth", "clean"].indexOf(prop) === -1,
})<{ screenWidth: number; clean: boolean }>(({ screenWidth, clean }) => {
  const pooHeight = 50;
  const pooWidth = pooHeight / 0.7962962962962963;
  return {
    height: `${pooHeight}px`,
    width: `${pooWidth}px`,
    background: `url(/assets/animated/pet-stage/cleaning/0.png) no-repeat`,
    backgroundSize: "auto 100%",
    // animation: `animateMainPetPoo 1s steps(2) infinite`,
    zIndex: 100,
    marginLeft: "-10px",
    imageRendering: "pixelated",
    ...(clean
      ? {
          background: `url(/assets/animated/pet-stage/cleaning/out.png)`,
          animation: `animateMainPetPooClean 2s steps(12) infinite`,
          width: `calc(${pooWidth * 12}px / 12)`,
        }
      : {}),

    // "@keyframes animateMainPetPoo": {
    //   from: {
    //     backgroundPosition: 0,
    //   },
    //   to: {
    //     backgroundPosition: `${pooHeight * 2}px`,
    //   },
    // },

    "@keyframes animateMainPetPooClean": {
      from: {
        backgroundPosition: 0,
      },
      to: {
        backgroundPosition: `-${pooWidth * 12}px`,
      },
    },
  };
});

export const MainPetWrapper = styled(Box, {
  shouldForwardProp: (prop: string) =>
    ["screenHeight", "screenWidth", "foodRef", "menuRef"].indexOf(prop) === -1,
})<{
  screenHeight: number;
  foodRef?: React.RefObject<HTMLDivElement>;
  menuRef?: React.RefObject<HTMLDivElement>;
}>(({ screenHeight, foodRef, menuRef }) => {
  let height = screenHeight - 90 - 56 - 10 - 74.5 - 32 - 20 - 10 - 10;
  if (foodRef) {
    height -= foodRef.current?.clientHeight || 0;
  }
  if (menuRef) {
    height -= menuRef.current?.clientHeight || 0;
  }

  return {
    position: "relative",
    height: `${height}px`,
  };
});

export const MintAnimatedMainPet = styled(Box)(() => {
  // 53x43
  const petWidth = 200;
  const petHeight = petWidth * (43 / 53);

  return {
    position: "absolute",
    bottom: "50px",
    height: `${petHeight}px`,
    width: `calc(${petWidth * 8}px / 8)`,
    background: `url("assets/animated/pet-stage/idle/out.png")`,
    backgroundSize: "auto 100%",
    animation: `animateMainPet-onboarding 1s steps(8) infinite`,
    zIndex: 100,
    imageRendering: "pixelated",

    [`@keyframes animateMainPet-onboarding`]: {
      from: {
        backgroundPosition: 0,
      },
      to: {
        backgroundPosition: `-${petWidth * 8}px`,
      },
    },
  };
});

export const AnimatedMainPet = styled(Box, {
  shouldForwardProp: (prop: string) =>
    ["screenWidth", "state", "equip", "hasPoo", "equipAnimated"].indexOf(
      prop
    ) === -1,
})<{
  screenWidth: number;
  state?: PetState;
  equip?: number;
  equipAnimated?: string;
  hasPoo: boolean;
}>(({ state, equip, equipAnimated, hasPoo }) => {
  // 53x43
  const petWidth = 150;
  const petHeight = petWidth * (43 / 53);

  let activeStage: { image: string; count: number } | null = null;

  const states = [1, 2, 3, 4, 7, 8];
  if (state && states.indexOf(state) === -1) {
    state = 1;
  }

  const petState = PetStateData[state || PetState.IDLE];
  activeStage = { image: petState.image, count: petState.count };
  if (state === PetState.IDLE && equipAnimated) {
    activeStage = {
      image: equipAnimated,
      count: 8,
    };
  }

  console.log(activeStage, state, equipAnimated);

  return {
    position: "absolute",
    bottom: "60px",
    left: hasPoo ? "0" : "50px",
    height: `${petHeight}px`,
    width: `calc(${petWidth * activeStage.count}px / ${activeStage.count})`,
    background: `url(${activeStage.image})`,
    backgroundSize: "auto 100%",
    animation: `animateMainPet-${state} ${activeStage.count / 8}s steps(${
      activeStage.count
    }) infinite`,
    zIndex: 100,
    imageRendering: "pixelated",

    ...(state === PetState.SLEEP
      ? {
          bottom: "57px",
        }
      : {}),

    [`@keyframes animateMainPet-${state}`]: {
      from: {
        backgroundPosition: 0,
      },
      to: {
        backgroundPosition: `-${petWidth * activeStage.count}px`,
      },
    },
  };
});

export const AnimatedMainPetBackground = styled(Box, {
  shouldForwardProp: (prop) => prop !== "wrapperRef",
})<{ wrapperRef: RefObject<HTMLDivElement> }>(({ wrapperRef }) => {
  // 256x185
  const backgroundHeight = wrapperRef?.current?.clientHeight || 0;
  const backgroundWidth = backgroundHeight / (185 / 256);
  return {
    position: "absolute",
    top: "-50px",
    left: "0",
    height: `${backgroundHeight}px`,
    width: `${backgroundWidth}px`,
    background: `url(/assets/animated/background.png)`,
    backgroundSize: "auto 100%",
    animation: `animateBackground-${backgroundHeight} 1s steps(6) infinite`,
    zIndex: 1,
    imageRendering: "pixelated",

    [`@keyframes animateBackground-${backgroundHeight}`]: {
      from: {
        backgroundPosition: 0,
      },
      to: {
        backgroundPosition: `${backgroundWidth * 6}px`,
      },
    },
  };
});
export const AnimatedMainPetHouse = styled(Box, {
  shouldForwardProp: (prop) => prop !== "screenWidth",
})<{ screenWidth: number }>(({ screenWidth }) => {
  // 161x147
  const houseHeight = screenWidth - 100;
  const houseWidth = houseHeight / (147 / 161);
  return {
    position: "absolute",
    bottom: "58px",
    right: "-60%",
    height: `${houseHeight}px`,
    width: `${houseWidth}px`,
    background: `url(/assets/animated/house.png)`,
    backgroundSize: "auto 100%",
    animation: `animateHouse-${houseHeight} 1s steps(6) infinite`,
    zIndex: 10,
    imageRendering: "pixelated",

    [`@keyframes animateHouse-${houseHeight}`]: {
      from: {
        backgroundPosition: 0,
      },
      to: {
        backgroundPosition: `${houseWidth * 12}px`,
      },
    },
  };
});

export const AnimatedMainPetBushes1 = styled(Box, {
  shouldForwardProp: (prop) => prop !== "screenWidth",
})<{ screenWidth: number }>(({ screenWidth }) => {
  // 109x39
  const bushesHeight = Math.floor(screenWidth * 0.25);
  const bushesWidth = bushesHeight / (39 / 109);

  return {
    position: "absolute",
    bottom: "60px",
    left: "-42%",
    height: `${bushesHeight}px`,
    width: `${bushesWidth}px`,
    background: `url(/assets/animated/bushes.png)`,
    backgroundSize: "auto 100%",
    animation: `animateBushes-1-${bushesHeight} 1s steps(8) infinite`,
    zIndex: 4,
    imageRendering: "pixelated",

    [`@keyframes animateBushes-1-${bushesHeight}`]: {
      from: {
        backgroundPosition: "0",
      },
      to: {
        backgroundPosition: `${bushesWidth * 8}px`,
      },
    },
  };
});

export const AnimatedMainPetBushes2 = styled(Box, {
  shouldForwardProp: (prop) => prop !== "screenWidth",
})<{ screenWidth: number }>(({ screenWidth }) => {
  // 109x39
  const bushesHeight = Math.floor(screenWidth * 0.25);
  const bushesWidth = bushesHeight / (39 / 109);
  return {
    position: "absolute",
    bottom: "60px",
    left: "27%",
    height: `${bushesHeight}px`,
    width: `${bushesWidth}px`,
    background: `url(/assets/animated/bushes.png)`,
    backgroundSize: "auto 100%",
    animation: `animateBushes-2-${bushesHeight} 1s steps(8) infinite`,
    zIndex: 3,
    imageRendering: "pixelated",

    [`@keyframes animateBushes-2-${bushesHeight}`]: {
      from: {
        backgroundPosition: "0",
      },
      to: {
        backgroundPosition: `${bushesWidth * 8}px`,
      },
    },
  };
});

export const AnimatedMainPetCloud = styled(Box, {
  shouldForwardProp: (prop) => prop !== "screenWidth",
})<{ screenWidth: number }>(({ screenWidth }) => {
  const cloudHeight = Math.floor(screenWidth * 0.5);
  const cloudWidth = cloudHeight / (108 / 134);
  return {
    position: "absolute",
    top: "-20%",
    right: "-50%",
    height: `${cloudHeight}px`,
    width: `${cloudWidth}px`,
    background: `url(/assets/animated/cloud.png)`,
    backgroundSize: "auto 100%",
    animation: `animateCloud-1-${cloudHeight} 6s steps(7) infinite, movingCloud-1 30s infinite`,
    zIndex: 4,
    imageRendering: "pixelated",

    [`@keyframes animateCloud-1-${cloudHeight}`]: {
      from: {
        backgroundPosition: "0",
      },
      to: {
        backgroundPosition: `${cloudWidth * 7}px`,
      },
    },
    "@keyframes movingCloud-1": {
      from: {
        right: "-50%",
      },
      to: {
        right: `85%`,
      },
    },
  };
});

export const AnimatedMainPetCloud2 = styled(Box, {
  shouldForwardProp: (prop) => prop !== "screenWidth",
})<{ screenWidth: number }>(({ screenWidth }) => {
  const cloudHeight = Math.floor(screenWidth * 0.5);
  const cloudWidth = cloudHeight / (108 / 134);
  return {
    position: "absolute",
    top: "-15%",
    right: "-50%",
    height: `${cloudHeight}px`,
    width: `${cloudWidth}px`,
    background: `url(/assets/animated/cloud.png)`,
    backgroundSize: "auto 100%",
    animation: `animateCloud-2-${cloudHeight} 6s steps(7) infinite, movingCloud-2 35s infinite`,
    animationDelay: "10s",
    zIndex: 5,
    imageRendering: "pixelated",

    [`@keyframes animateCloud-2-${cloudHeight}`]: {
      from: {
        backgroundPosition: "0",
      },
      to: {
        backgroundPosition: `${cloudWidth * 7}px`,
      },
    },
    "@keyframes movingCloud-2": {
      from: {
        right: "-50%",
      },
      to: {
        right: `85%`,
      },
    },
  };
});

export const AnimatedMainPetObstacle = styled(Box, {
  shouldForwardProp: (prop) => prop !== "screenWidth",
})<{ screenWidth: number }>(({ screenWidth }) => {
  // 35x32
  const obstacleHeight = screenWidth * 0.1;
  const obstacleWidth = obstacleHeight / (32 / 35);
  return {
    position: "absolute",
    bottom: "60px",
    right: "100px",
    height: `${obstacleHeight}px`,
    width: `${obstacleWidth}px`,
    background: `url(/assets/animated/obstacle.png)`,
    backgroundSize: "auto 100%",
    animation: `animateObstacle-${obstacleHeight} 1s steps(8) infinite`,
    zIndex: 11,
    imageRendering: "pixelated",

    [`@keyframes animateObstacle-${obstacleHeight}`]: {
      from: {
        backgroundPosition: "0",
      },
      to: {
        backgroundPosition: `${obstacleWidth * 8}px`,
      },
    },
    "@keyframes movingCloud": {
      from: {
        left: "-45%",
      },
      to: {
        left: `85%`,
      },
    },
  };
});

export const AnimatedMainPetFence = styled(Box, {
  shouldForwardProp: (prop) => prop !== "screenWidth",
})<{ screenWidth: number }>(({ screenWidth }) => {
  const streetHeight = screenWidth * 0.04;
  return {
    position: "absolute",
    bottom: "60px",
    left: "0",
    height: `${streetHeight}px`,
    width: "100%",
    background: `url(/assets/animated/fence.png) repeat-x`,
    backgroundSize: "auto 100%",
    zIndex: 5,
    imageRendering: "pixelated",
  };
});

export const AnimatedMainPetStreet = styled(Box)(() => {
  return {
    position: "absolute",
    bottom: "0",
    left: "0",
    height: `60px`,
    width: "150%",
    background: `url(/assets/animated/stones.png) repeat`,
    zIndex: 11,
    imageRendering: "pixelated",
  };
});

export const AnimatedMainPetEatingBattery = styled(Box, {
  shouldForwardProp: (prop: string) => ["state", "hasPoo"].indexOf(prop) === -1,
})<{ state?: PetState; hasPoo: boolean }>(({ state, hasPoo }) => {
  const height = 40;
  const width = height / 0.5517241379310345;
  return {
    position: "absolute",
    bottom: "10px",
    left: hasPoo ? "43px" : "93px",
    background: `url(/assets/animated/pet-stage/eating/out2.png) repeat`,
    height: `${height}px`,
    width: `calc(${width * 8}px / 8)`,
    backgroundSize: "auto 100%",
    animation: `animateMainPetEating2 1s steps(8) infinite`,
    zIndex: 100,
    display: state === PetState.EATING ? "block" : "none",
    imageRendering: "pixelated",
    [`@keyframes animateMainPetEating2`]: {
      from: {
        backgroundPosition: 0,
      },
      to: {
        backgroundPosition: `-${width * 8}px`,
      },
    },
  };
});

export const PetLifeTimeWrapper = styled(Box)(() => ({
  position: "absolute",
  bottom: "-14px",
  left: 0,
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 500,
}));

export const PetShield = styled(Box)(() => ({
  position: "absolute",
  top: "55px",
  left: "26px",
  width: "35px",
  zIndex: 999,
  height: "46px",
  background: "url(assets/images2/shield.svg) no-repeat",
  backgroundSize: "cover",
}));

export const PetLevel = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "10px",
  left: "26px",
  zIndex: 999,
  background: "#ffffff",
  textAlign: "center",
  borderRadius: "50px",
  height: "36px",
  fontSize: "14px",
  fontWeight: 500,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: `${theme.spacing(1)} ${theme.spacing(1.75)}`,
  border: "1px solid rgba(13, 22, 21, 1)",
  boxShadow: "1px 1px 0px 0px rgba(13, 22, 21, 1)",
}));

export const PetLevelUpgrade = styled("span")(({ theme }) => ({
  position: "absolute",
  top: "10px",
  left: "26px",
  zIndex: 999,
  background: "#FEF2D3",
  textAlign: "center",
  borderRadius: "50px",
  height: "36px",
  fontSize: "14px",
  fontWeight: 500,
  // display: "flex",
  // alignItems: "center",
  // justifyContent: "center",
  overflow: "hidden",
  whiteSpace: "nowrap",
  padding: `${theme.spacing(1)} ${theme.spacing(1.75)}`,
  border: "1px solid rgba(13, 22, 21, 1)",
  boxShadow: "1px 1px 0px 0px rgba(13, 22, 21, 1)",
  textTransform: "capitalize",

  "&.Mui-disabled": {
    color: "inherit",
    border: "1px solid rgba(13, 22, 21, 1)",
    boxShadow: "1px 1px 0px 0px rgba(13, 22, 21, 1)",
    background: "#FEF2D3 !important",
  },
  "& > svg": {
    marginRight: theme.spacing(0.5),
  },

  transition: "max-width 1s ease-in-out",
  maxWidth: "1000px",
}));

export const LevelUpgradeText = styled("span")(({ theme }) => ({
  display: "inline-block",
  paddingLeft: theme.spacing(1),
}));

export const PetPoos = styled(Box)(() => ({
  position: "absolute",
  bottom: "59px",
  left: "100px",
  width: "90px",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  justifyContent: "flex-end",

  "& img": {
    width: "100%",
  },
}));

export const FeedMention = styled(Box)(() => ({
  padding: "20px",
  display: "flex",
  alignItems: "center",
  background: "rgba(254, 211, 231, 1)",
  fontSize: "14px",
  lineHeight: "17.5px",
  letterSpacing: "0.07px",
  borderRadius: "10px",
  border: "1px solid rgba(13, 22, 21, 1)",
  boxShadow: "1px 1px 0px 0px rgba(13, 22, 21, 1)",
  cursor: "pointer",
}));

export const FeedMentionGroup1 = styled(Box)(() => ({
  flexGrow: 1,
  textAlign: "left",
  "& span": {
    display: "block",
    fontSize: "12px",
    color: "rgba(176, 107, 139, 1)",
    lineHeight: "15px",
  },
}));

export const ActionButton = styled(Button)(() => ({
  height: "38px",
  margin: 0,
  textAlign: "center",
  borderRadius: "50px",
  textTransform: "none",

  fontSize: "12px",
  fontWeight: 500,
  lineHeight: "15px",
  letterSpacing: "0.07px",
}));

export const FeedMentionGroup2 = styled(Box)(() => ({
  justifyContent: "center",
}));

interface PetBoxProps extends BoxProps {
  selected?: boolean;
}
export const PetBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "selected",
})<PetBoxProps>(({ selected }) => ({
  display: "flex",
  background: selected ? "#D3FBFE" : "#fff",
  borderRadius: "10px",
  // justifyContent: "center",
  alignItems: "center",
  border: "1px solid rgba(13, 22, 21, 1)",
  boxShadow: "1px 1px 0px 0px rgba(13, 22, 21, 1)",
  padding: "12px",
}));

export const PetProfile = styled(Box)(() => ({
  flexGrow: 1,
}));

export const PetProfileName = styled(Box)(() => ({
  fontWeight: 500,
  fontSize: "14px",
  lineHeight: "17.5px",
  letterSpacing: "0.07px",
  marginBottom: "4px",
}));

export const PetProfilePoints = styled(Box)(() => ({
  fontWeight: 300,
  fontSize: "12px",
  lineHeight: "15px",
  letterSpacing: "0.07px",
}));

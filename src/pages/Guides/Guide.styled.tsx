import {
  Box,
  BoxProps,
  Button,
  IconButton,
  Pagination,
  styled,
} from "@mui/material";

export const Content = styled(Box)(() => ({
  padding: "15px 20px",
  width: "100%",
  height: "100%",
}));

export const AvatarIconButton = styled(IconButton)(() => ({
  background: "#D3E4FE",
  marginRight: "10px",
}));

interface FoodProps extends BoxProps {
  selected?: boolean;
}

export const Main = styled(Box)(({ theme }) => ({
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
  "& img": {
    width: "40px",
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

  "& img": {
    width: "50px",
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
  borderRadius: "10px",
  display: "flex",
  width: "100%",
  height: "100%",
  justifyContent: "center",
  alignItems: "center",
  border: "1px solid rgba(13, 22, 21, 1)",
  boxShadow: "1px 1px 0px 0px rgba(13, 22, 21, 1)",
  background: "#fbf7f3",

  "& img": {
    width: "80%",
  },
}));

export const PetLifeTimeWrapper = styled(Box)(() => ({
  position: "absolute",
  bottom: "-14px",
  left: 0,
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));

export const PetShield = styled(Box)(() => ({
  position: "absolute",
  top: "30px",
  left: "26px",
  width: "35px",
  height: "46px",
  background: "url(assets/images/my-pet-shield.png) no-repeat",
}));

export const PetPoos = styled(Box)(() => ({
  position: "absolute",
  top: "0",
  right: "5px",
  width: "75px",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",

  "& img": {
    width: "100%",
  },
}));

export const PetVolume = styled(Box)(() => ({
  position: "absolute",
  top: "10px",
  right: "10px",
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

// export const ActionButton = styled(Button)(() => ({
//   height: "38px",
//   margin: 0,
//   textAlign: "center",
//   borderRadius: "50px",
//   textTransform: "none",

//   fontSize: "12px",
//   fontWeight: 500,
//   lineHeight: "15px",
//   letterSpacing: "0.07px",
// }));

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

export const LeaderboardInfo = styled(Box)(() => ({
  fontSize: "12px",
  fontWeight: "300",
  lineHeight: "15px",
  letterSpacing: "0.07px",
  textAlign: "left",
  marginBottom: "10px",
}));

export const LeaderboardBox = styled(Box)(() => ({
  display: "flex",
  background: "#fff",
  borderRadius: "10px",
  justifyContent: "center",
  alignItems: "center",
  border: "1px solid rgba(13, 22, 21, 1)",
  boxShadow: "1px 1px 0px 0px rgba(13, 22, 21, 1)",
  padding: "12px",
}));

export const LeaderboardRank = styled(Box)(() => ({
  marginRight: "12px",
}));

export const LeaderboardProfile = styled(Box)(() => ({
  flexGrow: "1",
}));
export const LeaderboardProfileName = styled(Box)(() => ({
  fontSize: "14px",
  fontWeight: "500",
  lineHeight: "18px",
  letterSpacing: "0.07px",
  textAlign: "left",
  marginBottom: "4px",
}));
export const LeaderboardProfilePoints = styled(Box)(() => ({
  fontSize: "12px",
  fontWeight: "300",
  lineHeight: "15px",
  letterSpacing: "0.07px",
  textAlign: "left",
}));

export const ActionButton = styled(Button)(() => ({
  minWidth: "90px",
  height: "38px",
  margin: 0,
  textAlign: "center",
  background: "rgba(0, 0, 0, 0.15)",
  borderRadius: "50px",
}));

export const ActionButtonHit = styled(Button)(() => ({
  minWidth: "110px",
  height: "38px",
  margin: 0,
  textAlign: "center",
  background: "#D3FBFE",
  borderRadius: "50px",
}));

export const ActionButtonKill = styled(Button)(() => ({
  minWidth: "110px",
  height: "38px",
  margin: 0,
  textAlign: "center",
  background: "#F4FFF1",
  borderRadius: "50px",
}));

export const StyledPagination = styled(Pagination)(() => ({
  "& ul": {
    justifyContent: "space-between",
  },
}));

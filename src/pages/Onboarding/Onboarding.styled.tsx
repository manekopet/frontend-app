import { Box, BoxProps, styled } from "@mui/material";
export const AccountActions = styled(Box)(() => ({
  marginBottom: "16px",
}));

export const StepContainer = styled(Box)(() => ({
  width: "100%",
}));

export const Container = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  backgroundColor: "#F7E8F6",
  // padding: "25px",
}));

export const ContentDescription = styled(Box)(() => ({
  fontSize: "14px",
  fontStyle: "normal",
  fontWeight: 300,
  lineHeight: "normal",
  letterSpacing: "0.07px",
  marginBottom: "20px",
}));

export const ContentTitle = styled(Box)(() => ({
  fontSize: "20px",
  fontStyle: "normal",
  fontWeight: 400,
  lineHeight: "normal",
  letterSpacing: "0.07px",
  fontFamily: "Geologica",
  marginBottom: "20px",
}));

export const StepDescription = styled(Box)(() => ({
  fontSize: "15px",
  fontStyle: "normal",
  fontWeight: "500",
  lineHeight: "normal",
  letterSpacing: "0.07px",
  textAlign: "left",
}));
export const StepSubDescription = styled(Box)(() => ({
  color: "#ababab",
  fontFamily: "Geologica",
  fontSize: "13px",
  fontStyle: "normal",
  fontWeight: "300",
  lineHeight: "normal",
  letterSpacing: "0.07px",
  textAlign: "left",
}));

export const WalletAmountBox = styled(Box)(() => ({
  width: "100%",
  display: "flex",
  background: "#fff",
  boxShadow: " 1px 1px 0px 0px #0D1615",
  borderRadius: "10px",
  border: "1px solid #0D1615",
  padding: "10px",
  fontSize: "12px",
  fontStyle: "normal",
  fontWeight: 500,
  lineHeight: "15px",
  letterSpacing: "0.07px",

  "& > svg": {
    marginRight: "10px",
  },
}));

interface WalletAmountProps extends BoxProps {
  isFetching?: boolean;
}
export const WalletAmount = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isFetching",
})<WalletAmountProps>(({ isFetching }) => ({
  opacity: isFetching ? 0.1 : 1,
  transition: "opacity 0.8s ease-in-out",
}));

export const WalletAddressBox = styled(Box)(() => ({
  display: "flex",
  width: "100%",
  background: "#fff",
  boxShadow: "1px 1px 0px 0px #0D1615",
  borderRadius: "10px",
  border: "1px solid #0D1615",
  padding: "10px",
}));

export const WalletAddressBoxAddress = styled(Box)(() => ({
  textOverflow: "ellipsis",
  overflow: "hidden",
  fontSize: "12px",
  fontStyle: "normal",
  fontWeight: 400,
  lineHeight: "15px",
  letterSpacing: "0.07px",
}));

export const SwapInputBoxWrapper = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
}));
export const SwapInputBox = styled(Box)(() => ({
  display: "flex",
  background: "#fff",
  boxShadow: " 1px 1px 0px 0px #0D1615",
  borderRadius: "10px",
  border: "1px solid #0D1615",
  padding: "10px",
  flexDirection: "column",
  width: "100%",
}));

export const SwapInputBoxContent = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  marginBottom: "4px",

  "&:last-child": {
    marginBottom: 0,
  },
}));

export const SwapInputBoxLabel = styled(Box)(() => ({
  fontSize: "12px",
  fontWeight: 300,
  lineHeight: "15px",
  letterSpacing: "0.07px",
  color: "#ABABAB",
}));
interface SwapInputBoxBalanceProps extends BoxProps {
  isFetching?: boolean;
}
export const SwapInputBoxBalance = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isFetching",
})<SwapInputBoxBalanceProps>(({ isFetching }) => ({
  fontSize: "12px",
  fontWeight: 300,
  lineHeight: "14px",
  letterSpacing: "0.07px",
  textAlign: "right",
  opacity: isFetching ? 0.1 : 1,
  transition: "opacity 0.8s ease-in-out",
}));
export const SwapInputBoxInput = styled(Box)(() => ({
  fontSize: "14px",
  fontWeight: 500,
  lineHeight: "17.5px",
  letterSpacing: "0.07px",
  width: "100%",

  "& input": {
    padding: 0,
    fontSize: "14px",
    fontWeight: 500,
    lineHeight: "17.5px",
    letterSpacing: "0.07px",
    width: "100%",
  },
}));
export const SwapInputBoxUnit = styled(Box)(() => ({
  display: "flex",
  width: "60px",
  fontSize: "12px",
  fontWeight: 500,
  lineHeight: "15px",
  letterSpacing: "0.07px",
  alignItems: "center",
  justifyContent: "center",

  "& svg": {
    marginRight: "6px",
  },
}));

export const AnimatedMainPet = styled(Box)(() => {
  // 53x43
  const petWidth = 150;
  const petHeight = petWidth * (43 / 53);

  return {
    position: "absolute",
    bottom: "20px",
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

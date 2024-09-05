// import Onboarding from "./pages/Onboarding/Onboarding";

import * as amplitude from "@amplitude/analytics-browser";
import { Box, styled } from "@mui/material";
import React, { useEffect } from "react";
import { isAndroid, isIOS } from "react-device-detect";
import ReactGA from "react-ga";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import FirstLoading from "./components/FirstLoading";
import Loader from "./components/Loader";
import RewardModal from "./components/RewardModal";
import { useDispatch } from "./hooks/redux";
import ReactTourProvider from "./providers/ReactTourProvider";
import authSlice from "./redux/features/auth/slice";
import Routes from "./routes";

const StyledToastContainer = styled(ToastContainer)`
  &&&.Toastify__toast-container {
    padding-top: 10px;
  }
  .Toastify__toast {
    width: 70%;
    margin: 0 auto;
    margin-bottom: 10px;
    border-radius: 10px;
    box-shadow: 1px 1px 0px 0px #0d1615;
    border: 1px solid #0d1615;
    font-family: Geologica;
    font-size: 12px;
    font-weight: 300;
    line-height: 15px;
    letter-spacing: 0.07px;
    text-align: left;
    min-height: auto;
    color: #000;
  }
  .Toastify__toast-body {
  }
  .Toastify__progress-bar {
  }
`;
ReactGA.initialize("G-4K4HJGXMVH");

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

const MainWrapper = styled(Box)(() => {
  const dbg = getRandomInt(3);
  return {
    position: "relative",
    background: `url("/assets/images2/dbg-${dbg + 1}.jpg") no-repeat`,
    backgroundSize: "cover",
    backgroundColor: "#F7E8F6",
    height: "100vh",
    overflow: "hidden",
    width: `100%`,
  };
});

const Main = styled("main")(({ theme }) => {
  const isMobile = isIOS || isAndroid;

  return {
    position: "relative",
    backgroundColor: "#F7E8F6",
    flexGrow: 1,
    height: "100vh",
    overflow: "hidden",
    width: `100%`,
    maxWidth: isMobile ? "100%" : "480px",
    margin: isMobile ? "auto" : "0 auto",
  };
});

// const GuideModalBox = styled(Box)(({ theme }) => ({
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: "80%",
//   background: "#fff",
//   padding: theme.spacing(3),
//   textAlign: "center",
// }));

// const GuideModalTitle = styled(Box)(() => ({
//   fontSize: "20px",
//   fontWeight: "500",
//   lineHeight: "20px",
//   letterSpacing: "0.07px",
//   textAlign: "center",
//   marginBottom: "30px",
// }));

// const GuideModalContent = styled(Box)(() => ({
//   fontSize: "14px",
//   fontWeight: "400",
//   lineHeight: "20px",
//   letterSpacing: "0.07px",
//   textAlign: "center",
//   marginBottom: "30px",

//   "& svg": {
//     verticalAlign: "middle",
//   },
// }));

const App = () => {
  const query = new URLSearchParams(window.location.search);
  // const { finishedCheck, isPWA } = useIsPWA();

  const dispatch = useDispatch();

  // const isMobile = isIOS || isAndroid;

  // const renderGuideModalDescription = () => {
  //   if (isIOS) {
  //     return <>Tap {<IosShareIcon />} then "Add to Home Screen"</>;
  //   }
  //   return <>Tap {<MoreVertIcon />} then "Install App"</>;
  // };

  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
    amplitude.init("da6e9b8ebba2b9de4dfbca85c3d4b316");
    if (query.get("referral") !== null) {
      dispatch(authSlice.actions.setReferral(String(query.get("referral"))));
    }
  }, []);

  // console.log("check", { finishedCheck, isPWA });

  // if (!finishedCheck) {
  //   return <Loader />;
  // }

  return (
    <ReactTourProvider>
      <FirstLoading />
      <StyledToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
      />
      <RewardModal />
      {/* <Modal
        sx={{ position: "absolute" }}
        container={() => document.getElementById("main-app")}
        open={isMobile && !isPWA}
        style={{ zIndex: 99999 }}
      >
        <GuideModalBox>
          <GuideModalTitle>Install ManekoPet App</GuideModalTitle>
          <GuideModalContent>{renderGuideModalDescription()}</GuideModalContent>
        </GuideModalBox>
      </Modal> */}
      {/* <InviteCode /> */}
      <React.Suspense fallback={<Loader />}>
        <MainWrapper>
          <Main id="main-app">
            <Routes />
          </Main>
        </MainWrapper>
      </React.Suspense>
    </ReactTourProvider>
  );
};
export default App;

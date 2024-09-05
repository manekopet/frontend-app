import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { styled } from "@mui/material/styles";

// project imports

import { ReactComponent as MenuHistoryIcon } from "@/assets/svg/menu-history.svg";
import { ReactComponent as MenuLeaderboardIcon } from "@/assets/svg/menu-leaderboard.svg";
import { ReactComponent as MenuMyPetIcon } from "@/assets/svg/menu-my-pet.svg";
import { ReactComponent as MenuReferralIcon } from "@/assets/svg/menu-referral.svg";
import Loader from "@/components/Loader";
import { BottomNavigation, BottomNavigationAction, Box } from "@mui/material";
import React from "react";

// ==============================|| MAIN LAYOUT ||============================== //
const Main = styled("main")(({ theme }) => ({
  position: "relative",
  backgroundColor: "#F7E8F6",
  flexGrow: 1,
  height: "100vh",
  overflow: "hidden",
  width: `100%`,
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  paddingBottom: "90px",
  maxWidth: "500px",
}));

const Content = styled(Box)(({ theme }) => ({
  height: "100%",
  overflowY: "auto",
}));

const Navigation = styled(Box)(() => ({
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  maxWidth: "500px",
}));

const StyledBottomNavigationAction = styled(BottomNavigationAction)(() => ({
  "& .MuiBottomNavigationAction-label": {
    whiteSpace: "nowrap",
  },
}));

const MainLayout: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  return (
    <Main>
      <ContentWrapper>
        <Content id="scrollableDiv">
          <React.Suspense fallback={<Loader />}>
            <Outlet />
          </React.Suspense>
        </Content>
      </ContentWrapper>
      <Navigation>
        <BottomNavigation
          showLabels
          value={pathname}
          onChange={(event, newValue) => {
            navigate(newValue);
            console.log(newValue);
          }}
        >
          <StyledBottomNavigationAction
            label="My Pet"
            value={"/my-pet"}
            icon={<MenuMyPetIcon fill="currentColor" />}
          />
          <StyledBottomNavigationAction
            label="Leaderboard"
            value={"/leaderboard"}
            icon={<MenuLeaderboardIcon fill="currentColor" />}
          />
          <StyledBottomNavigationAction
            label="History"
            value={"/history"}
            icon={<MenuHistoryIcon fill="currentColor" />}
          />
          <StyledBottomNavigationAction
            label="Refer"
            value={"/refer-and-earn"}
            icon={<MenuReferralIcon fill="currentColor" />}
          />
        </BottomNavigation>
      </Navigation>
    </Main>
  );
};

export default MainLayout;

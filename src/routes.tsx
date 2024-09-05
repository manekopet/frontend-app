import {
  Navigate,
  RouteObject,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage";
// import Onboarding from "./pages/Onboarding/Onboarding";
import { lazy } from "react";
import { useSelector } from "./hooks/redux";
import MainLayout from "./layouts/MainLayout";
import RootLayout from "./layouts/RootLayout";
import DepositPage from "./pages/Wallet/DepositPage";
import SwapPage from "./pages/Wallet/SwapPage";
import WithDrawPage from "./pages/Wallet/WithdrawPage";
import { authSelector } from "./redux/features/auth/selectors";
import { lazyRetry } from "./utils/lazyRetry";

const AchievementsPage = lazy(() =>
  lazyRetry(() => import("./pages/Achievements/Achievements"))
);
const DicePage = lazy(() => lazyRetry(() => import("./pages/Dice/Dice")));
const GuidePage = lazy(() => lazyRetry(() => import("./pages/Guides/Guide")));
const HistoryPage = lazy(() =>
  lazyRetry(() => import("./pages/History/History"))
);
const LeaderBoardPage = lazy(() =>
  lazyRetry(() => import("./pages/LeaderBoard/LeaderBoard"))
);
const ReferEarnMorePage = lazy(() =>
  lazyRetry(() => import("./pages/ReferEarnMore"))
);
const ReferEarnInvitePage = lazy(() =>
  lazyRetry(() => import("./pages/ReferEarnInvite"))
);
const MyPetPage = lazy(() => lazyRetry(() => import("./pages/MyPet/MyPet")));
const Onboarding = lazy(() =>
  lazyRetry(() => import("./pages/Onboarding/Onboarding"))
);
const ShopPage = lazy(() => lazyRetry(() => import("./pages/Shop/Shop")));
const ArcadesPage = lazy(() =>
  lazyRetry(() => import("./pages/Arcades/Arcades"))
);
const DailyRewardsPage = lazy(() => lazyRetry(() => import("./pages/DailyRewards")));
const FaucetPage = lazy(() => lazyRetry(() => import("./pages/Faucet/Faucet")));
const PredictPage = lazy(() =>
  lazyRetry(() => import("./pages/Predict/index"))
);
const SpinTheWheelPage = lazy(() =>
  lazyRetry(() => import("./pages/SpinTheWheel/SpinTheWheel"))
);
const WalletPage = lazy(() => lazyRetry(() => import("./pages/Wallet/Wallet")));
const ReferAndEarn = lazy(() =>
  lazyRetry(() => import("./pages/ReferAndEarn"))
);
const ReferralCodePage = lazy(() =>
  lazyRetry(() => import("./pages/ReferralCode"))
);

const HistoryWalletPage = lazy(() =>
  lazyRetry(() => import("./pages/HistoryWallet/HistoryWallet"))
);

export const AuthRoutes = () => {
  return [
    { path: "/login", element: <LoginPage /> },
    { path: "*", element: <Navigate to="/login" /> },
  ];
};

export const OnboardingRoutes = () => {
  return [
    {
      path: "/onboarding",
      element: <Onboarding />,
    },
    { path: "*", element: <Navigate to="/onboarding" /> },
  ];
};

export const ReferralCodeRoutes = () => {
  return [
    {
      path: "/referral-code",
      element: <ReferralCodePage />,
    },
    { path: "*", element: <Navigate to="/referral-code" /> },
  ];
};

export const AppRoutes = () => {
  return [
    {
      element: <MainLayout />,
      children: [
        { path: "/guide", element: <GuidePage /> },
        { path: "/my-pet", element: <MyPetPage /> },
        { path: "/leaderboard", element: <LeaderBoardPage /> },
        { path: "/wallet", element: <WalletPage /> },
        { path: "/wallet/deposit", element: <DepositPage /> },
        { path: "/wallet/swap", element: <SwapPage /> },
        { path: "/wallet/withdraw", element: <WithDrawPage /> },
        { path: "/history", element: <HistoryPage /> },
        { path: "/daily-rewards", element: <DailyRewardsPage /> },
        { path: "/history-wallet", element: <HistoryWalletPage /> },
        { path: "/refer-and-earn", element: <ReferAndEarn /> },
        { path: "*", element: <Navigate to="/my-pet" /> },
      ],
    },
    {
      path: "arcades",
      element: <RootLayout />,
      children: [
        { index: true, element: <ArcadesPage /> },
        { path: "spin-the-wheel", element: <SpinTheWheelPage /> },
        { path: "dice", element: <DicePage /> },
        { path: "predict", element: <PredictPage /> },
      ],
    },
    { path: "/achievements", element: <AchievementsPage /> },
    { path: "/shop", element: <ShopPage /> },
    { path: "/faucet", element: <FaucetPage /> },
    { path: "/refer-earn-more", element: <ReferEarnMorePage /> },
    { path: "/refer-earn-invite", element: <ReferEarnInvitePage /> },
    { path: "*", element: <Navigate to="/my-pet" /> },
  ];
};

const Routes = () => {
  const userInfo = useSelector(authSelector.selectUser);
  const isFinishedOnboarding = useSelector(
    authSelector.selectIsFinishOnboarding
  );
  let routes: RouteObject[] = AuthRoutes();
  if (userInfo) {
    if (userInfo.invitedBy === "") {
      routes = ReferralCodeRoutes();
    } else {
      if (!isFinishedOnboarding) {
        routes = OnboardingRoutes();
      } else {
        routes = AppRoutes();
      }
    }
  }
  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
};

export default Routes;

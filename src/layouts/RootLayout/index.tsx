import Loader from "@/components/Loader";
import { styled } from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";

const Main = styled("main")(({ theme }) => ({
  position: "relative",
  backgroundColor: "#F7E8F6",
  flexGrow: 1,
  height: "100vh",
  overflow: "hidden",
  width: `100%`,
}));

const RootLayout: React.FC = () => {
  return (
    <React.Suspense fallback={<Loader />}>
      <Main>
        <Outlet />
      </Main>
    </React.Suspense>
  );
};

export default RootLayout;

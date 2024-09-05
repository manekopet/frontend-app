import { MainContent } from "@/components/presentation/MainContent";
import * as amplitude from "@amplitude/analytics-browser";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import { AppBar, Box, IconButton, Toolbar } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Page: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    amplitude.track("share-clicked");
  }, []);

  const handleBack = () => {
    navigate("/my-pet");
  };

  return (
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
          Photo
        </Toolbar>
      </AppBar>
      <Box>Coming soon</Box>
    </MainContent>
  );
};

export default Page;

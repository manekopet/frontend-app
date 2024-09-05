import { MainContent } from "@/components/presentation/MainContent";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import { AppBar, Box, IconButton, Toolbar } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Page: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/arcades");
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
          Dice
        </Toolbar>
      </AppBar>
      <Box>Dice</Box>
    </MainContent>
  );
};

export default Page;

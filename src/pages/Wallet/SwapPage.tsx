import FlexGrow from "@/components/presentation/FlexGrow";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import { Box, IconButton, Toolbar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SwapForm from "../Onboarding/SwapForm";

export default function SwapPage() {
  const navigate = useNavigate();
  return (
    <Box
      sx={{ width: "100%", padding: "0 20px", marginTop: "15px" }}
      role="presentation"
    >
      <Toolbar disableGutters>
        <IconButton
          size="small"
          edge="start"
          color="inherit"
          onClick={() => navigate(-1)}
          sx={{ mr: 2, background: "#fff" }}
        >
          <ArrowLeftIcon fontSize="small" />
        </IconButton>
        <span style={{ fontWeight: 600 }}>Swap</span>
        <FlexGrow />
      </Toolbar>
      <div style={{ marginTop: 24 }}></div>
      <SwapForm />
    </Box>
  );
}

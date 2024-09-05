import FlexGrow from "@/components/presentation/FlexGrow";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import { Box, IconButton, Toolbar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import FormDeposit from "./components/FormDeposit";
// import FormDeposit from "./FormDeposit";

export default function DepositPage() {
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
        <span style={{ fontWeight: 600 }}>Transfer Spending</span>
        <FlexGrow />
      </Toolbar>
      <FormDeposit />
    </Box>
  );
}

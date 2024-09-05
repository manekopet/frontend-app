import FlexGrow from "@/components/presentation/FlexGrow";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import { Box, IconButton, SwipeableDrawer, Toolbar } from "@mui/material";
import FormWithdraw from "./FormWithdraw";

export default function Withdrawal({
  isNativeToken,
  openSideBar,
  toggleDrawer,
}: {
  isNativeToken: boolean;
  openSideBar: boolean;
  toggleDrawer: any;
}) {
  return (
    <SwipeableDrawer
      anchor={"left"}
      open={openSideBar}
      onClose={toggleDrawer("left", false)}
      onOpen={toggleDrawer("left", true)}
      className="side-bar-pet"
    >
      <Box
        sx={{ width: "100%", padding: "0 20px", marginTop: "15px" }}
        role="presentation"
      >
        <Toolbar disableGutters>
          <IconButton
            onClick={toggleDrawer("left", false)}
            size="small"
            edge="start"
            color="inherit"
            sx={{ mr: 2, background: "#fff" }}
          >
            <ArrowLeftIcon fontSize="small" />
          </IconButton>
          Withdraw {isNativeToken ? "SOL" : "MGEM"}
          <FlexGrow />
        </Toolbar>
        <FormWithdraw />
      </Box>
    </SwipeableDrawer>
  );
}

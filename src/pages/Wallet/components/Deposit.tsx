import FlexGrow from "@/components/presentation/FlexGrow";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import { Box, IconButton, SwipeableDrawer, Toolbar } from "@mui/material";
import FormDeposit from "./FormDeposit";

export default function Deposit({
  openSideBar,
  toggleDrawer,
}: {
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
          Deposit MGEM
          <FlexGrow />
        </Toolbar>
        <FormDeposit />
      </Box>
    </SwipeableDrawer>
  );
}

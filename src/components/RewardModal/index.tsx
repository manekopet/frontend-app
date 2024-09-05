import rewardAnimation from "@/assets/json/reward.json";
import { useDispatch } from "@/hooks/redux";
import { appSelectors } from "@/redux/features/app/selectors";
import appSlice from "@/redux/features/app/slice";
import { Box, Modal, styled } from "@mui/material";
import Lottie from "lottie-react";
import { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";

const RewardContent = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  padding: `${theme.spacing(2)} ${theme.spacing(4)} ${theme.spacing(3)}`,
}));

const RewardPoints = styled(Box)(() => ({
  fontSize: "20px",
  fontWeight: 600,
}));

const RewardLabel = styled(Box)(() => ({
  fontSize: "12px",
  fontWeight: 300,
  color: "A7A7A7",
  opacity: ".7",
}));

const RewardAnimation = styled(Box)(() => ({
  position: "absolute",
  top: "-100%",
}));

const RewardModal = () => {
  const dispatch = useDispatch();
  const reward = useSelector(appSelectors.selectReward);
  const handleClose = useCallback(() => {
    dispatch(appSlice.actions.closeRewardModal());
  }, [dispatch]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (reward.modal) {
      timeout = setTimeout(() => {
        if (reward.modal) {
          handleClose();
        }
      }, 5000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [reward.modal, handleClose]);

  return (
    <Modal
      sx={{ position: "absolute" }}
      container={() => document.getElementById("main-app")}
      open={reward.modal}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <RewardContent sx={{ outline: "none" }}>
        <RewardAnimation>
          <Lottie animationData={rewardAnimation} loop={true} />
        </RewardAnimation>
        <img
          src="/assets/images2/mypet-archievements.svg"
          alt="reward"
          width={96}
          height={96}
          style={{ marginRight: "5px" }}
        />
        <RewardPoints>
          {reward.points} {reward.symbol}
        </RewardPoints>
        <RewardLabel>Reward</RewardLabel>
      </RewardContent>
    </Modal>
  );
};

export default RewardModal;

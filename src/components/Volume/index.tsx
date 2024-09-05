import { ReactComponent as VolumeMuteIcon } from "@/assets/svg/volume-mute.svg";
import { ReactComponent as VolumeIcon } from "@/assets/svg/volume.svg";
import { useDispatch, useSelector } from "@/hooks/redux";
import { appSelectors } from "@/redux/features/app/selectors";
import appSlice from "@/redux/features/app/slice";
import { Box, SvgIcon, styled } from "@mui/material";
import { FC } from "react";

const Main = styled(Box)(() => ({}));

const Volume: FC = () => {
  const dispatch = useDispatch();
  const mute = useSelector(appSelectors.selectMute);

  const handleToggleMute = () => {
    if (mute) {
      dispatch(appSlice.actions.unmute());
    } else {
      dispatch(appSlice.actions.mute());
    }
  };

  return (
    <Main>
      <SvgIcon onClick={handleToggleMute}>
        {mute ? <VolumeMuteIcon /> : <VolumeIcon />}
      </SvgIcon>
    </Main>
  );
};

export default Volume;

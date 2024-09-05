import { PetWithState } from "@/types/pet";
import { balanceDisplayer } from "@/utils/convert";
import { Box, styled } from "@mui/material";
import { FC } from "react";

const Container = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  fontSize: "20px",
  fontWeight: 500,
  lineHeight: "25px",
  letterSpacing: "0.07px",
}));

const ProfileName = styled(Box)(() => ({
  fontWeight: 500,
  fontSize: "13px",
  // lineHeight: "17.5px",
  letterSpacing: "0.07px",
  marginBottom: "4px",
}));

const ProfilePoints = styled(Box)(() => ({
  fontWeight: 700,
  fontSize: "11px",
  lineHeight: "15px",
  letterSpacing: "0.07px",
}));

interface HeaderProfileProps {
  activePet: PetWithState | null;
  setShowModalEditPetName: any;
}

const HeaderProfile: FC<HeaderProfileProps> = ({
  activePet,
  setShowModalEditPetName,
}) => {
  const showModalUpdatePetName = () => {
    if (activePet) {
      setShowModalEditPetName(true);
    }
  };
  return (
    <Container>
      <ProfileName onClick={() => showModalUpdatePetName()}>
        {activePet?.pet?.name || "pet"} (#{activePet?.pet?.nftId})
      </ProfileName>
      <ProfilePoints>
        {activePet?.pet?.petScore
          ? balanceDisplayer(String(activePet?.pet?.petScore), 2)
          : 0}{" "}
        PTS
      </ProfilePoints>
    </Container>
  );
};

export default HeaderProfile;

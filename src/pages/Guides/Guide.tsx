import { ReactComponent as AttackIcon } from "@/assets/svg/leaderboard-action-attack.svg";
import Volume from "@/components/Volume";
import { useSelector } from "@/hooks/redux";
import { petSelectors } from "@/redux/features/pet/selectors";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { useTour } from "@reactour/tour";

import {
  AppBar,
  Box,
  Button,
  ButtonProps,
  Grid,
  PaginationRenderItemParams,
  styled,
  Toolbar,
} from "@mui/material";
import { useEffect, useState } from "react";
// import { CoachMark, ICoachProps } from "react-coach-mark";
import { MainContent } from "@/components/presentation/MainContent";
import { onboardingSelectors } from "@/redux/features/onboarding/selectors";
import { useNavigate } from "react-router-dom";
import HeaderProfile from "../../components/HeaderProfile";
import HeaderWallet from "../../components/HeaderWallet";
import FlexGrow from "../../components/presentation/FlexGrow";
import SquareBox from "../../components/presentation/SquareBox";
import {
  ActionButtonHit,
  ActionButtonKill,
  // ActionButton,
  AvatarIconButton,
  FeedMention,
  FeedMentionGroup1,
  FeedMentionGroup2,
  Food,
  LeaderboardBox,
  LeaderboardInfo,
  LeaderboardProfile,
  LeaderboardProfileName,
  LeaderboardProfilePoints,
  LeaderboardRank,
  Main,
  MainPetBox,
  Menu,
  PetLifeTimeWrapper,
  PetPoos,
  PetVolume,
  StyledPagination,
} from "./Guide.styled";

interface PagingButtonProps extends ButtonProps {
  selected?: boolean;
}

const PagingButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "selected",
})<PagingButtonProps>(({ selected }) => ({
  minWidth: "35px",
  height: "35px",
  padding: 0,
  background: selected ? "#FED3E7" : "#fff",

  "&:hover": {
    background: "#fff",
  },
}));

const Guide: React.FC = () => {
  const navigate = useNavigate();
  const [showModalEditPetName, setShowModalEditPetName] = useState(false);
  const activePet = useSelector(petSelectors.selectActivePet);
  const currentStep = useSelector(onboardingSelectors.selectCurrentStep);
  const isFinished = useSelector(onboardingSelectors.selectFinishStep);
  const [activatedNumber, setActivateNumber] = useState<number>(0);

  const { setIsOpen, isOpen } = useTour();

  const renderPaginationItem = ({
    type,
    page,
    selected,
    onClick,
  }: PaginationRenderItemParams) => {
    if (type === "next") {
      return (
        <PagingButton>
          <ArrowRightIcon />
        </PagingButton>
      );
    } else if (type === "previous") {
      return (
        <PagingButton>
          <ArrowLeftIcon />
        </PagingButton>
      );
    } else if (type === "start-ellipsis" || type === "end-ellipsis") {
      return <PagingButton>...</PagingButton>;
    }
    return (
      <PagingButton onClick={onClick} selected={selected}>
        {page}
      </PagingButton>
    );
  };

  useEffect(() => {
    if (isOpen) return () => {};
    if (!isFinished) {
      const timeId = setTimeout(() => {
        setIsOpen(true);
      }, 2000);
      return () => clearTimeout(timeId);
    }
    return () => {};
  }, [isOpen, isFinished]);

  useEffect(() => {
    if (isFinished) {
      navigate("/my-pet");
    }
  }, [isFinished]);

  // const coach: ICoachProps = coachList[activatedNumber];
  return (
    <MainContent>
      {/* <CoachMark {...coach} /> */}
      {currentStep === 6 || currentStep === 7 ? (
        <>
          <AppBar position="relative">
            <Toolbar disableGutters>
              Leaderboard
              <FlexGrow />
              <HeaderWallet />
            </Toolbar>
          </AppBar>
          <LeaderboardInfo>
            Attack players with higher points than you every 15 minutes and earn
            1% of their rewards. Pet can only be attacked once per hour.
          </LeaderboardInfo>
        </>
      ) : (
        <AppBar position="relative" style={{ marginBottom: 15 }}>
          <Toolbar disableGutters>
            <AvatarIconButton sx={{ mr: "12px" }}>
              <img
                src="assets/images/icon-pet.png"
                alt="pet"
                style={{ width: "20px" }}
              />
            </AvatarIconButton>
            <HeaderProfile
              setShowModalEditPetName={setShowModalEditPetName}
              activePet={activePet}
            />
            <FlexGrow />
            <HeaderWallet />
          </Toolbar>
        </AppBar>
      )}

      {/* {activatedNumber == 6 ? ( */}
      <Grid
        style={{
          display: `${currentStep > 5 ? "" : "none"}`,
        }}
        container
        spacing={2}
        sx={{ mb: "20px" }}
      >
        <Grid item xs={12}>
          <LeaderboardBox>
            <LeaderboardRank>
              <Button size="small">#1</Button>
            </LeaderboardRank>
            <LeaderboardProfile>
              <LeaderboardProfileName>Manoko Pet</LeaderboardProfileName>
              <LeaderboardProfilePoints>1350.22 pts</LeaderboardProfilePoints>
            </LeaderboardProfile>
            <Box>
              <ActionButtonHit startIcon={<AttackIcon />}>Hit</ActionButtonHit>
            </Box>
          </LeaderboardBox>
        </Grid>
        <Grid item xs={12}>
          <LeaderboardBox>
            <LeaderboardRank>
              <Button size="small">#2</Button>
            </LeaderboardRank>
            <LeaderboardProfile>
              <LeaderboardProfileName>Manoko Pet 1</LeaderboardProfileName>
              <LeaderboardProfilePoints>1350.22 pts</LeaderboardProfilePoints>
            </LeaderboardProfile>
            <Box>
              <ActionButtonHit startIcon={<AttackIcon />}>Hit</ActionButtonHit>
            </Box>
          </LeaderboardBox>
        </Grid>
        <Grid item xs={12}>
          <LeaderboardBox>
            <LeaderboardRank>
              <Button size="small">#3</Button>
            </LeaderboardRank>
            <LeaderboardProfile>
              <LeaderboardProfileName>Manoko Pet 2</LeaderboardProfileName>
              <LeaderboardProfilePoints>1350.22 pts</LeaderboardProfilePoints>
            </LeaderboardProfile>
            <Box>
              <ActionButtonHit startIcon={<AttackIcon />}>Hit</ActionButtonHit>
            </Box>
          </LeaderboardBox>
        </Grid>
        <Grid item xs={12}>
          <LeaderboardBox>
            <LeaderboardRank>
              <Button size="small">#4</Button>
            </LeaderboardRank>
            <LeaderboardProfile>
              <LeaderboardProfileName>Manoko Pet 3</LeaderboardProfileName>
              <LeaderboardProfilePoints>1350.22 pts</LeaderboardProfilePoints>
            </LeaderboardProfile>
            <Box>
              <ActionButtonHit startIcon={<AttackIcon />}>Hit</ActionButtonHit>
            </Box>
          </LeaderboardBox>
        </Grid>
        <Grid item xs={12} className="step-07">
          <LeaderboardBox>
            <LeaderboardRank>
              <Button size="small">#5</Button>
            </LeaderboardRank>
            <LeaderboardProfile>
              <LeaderboardProfileName>Manoko Pet 4</LeaderboardProfileName>
              <LeaderboardProfilePoints>1350.22 pts</LeaderboardProfilePoints>
            </LeaderboardProfile>
            <Box>
              <ActionButtonHit startIcon={<AttackIcon />}>Hit</ActionButtonHit>
            </Box>
          </LeaderboardBox>
        </Grid>
        <Grid item xs={12} className="step-08">
          <LeaderboardBox>
            <LeaderboardRank>
              <Button size="small">#6</Button>
            </LeaderboardRank>
            <LeaderboardProfile>
              <LeaderboardProfileName>Manoko Pet 5</LeaderboardProfileName>
              <LeaderboardProfilePoints>1350.22 pts</LeaderboardProfilePoints>
            </LeaderboardProfile>
            <Box>
              <ActionButtonKill
                startIcon={
                  <img src="assets/images/ghost.png" alt="ghost" width="16px" />
                }
              >
                KILL
              </ActionButtonKill>
            </Box>
          </LeaderboardBox>
        </Grid>
        <Grid item xs={12}>
          <LeaderboardBox>
            <LeaderboardRank>
              <Button size="small">#7</Button>
            </LeaderboardRank>
            <LeaderboardProfile>
              <LeaderboardProfileName>Manoko Pet 6</LeaderboardProfileName>
              <LeaderboardProfilePoints>1350.22 pts</LeaderboardProfilePoints>
            </LeaderboardProfile>
            <Box>
              <ActionButtonHit startIcon={<AttackIcon />}>Hit</ActionButtonHit>
            </Box>
          </LeaderboardBox>
        </Grid>
      </Grid>
      <StyledPagination
        style={{
          display: `${activatedNumber > 6 ? "" : "none"}`,
        }}
        count={7}
        page={1}
        renderItem={renderPaginationItem}
        variant="outlined"
        shape="rounded"
      />
      {/* ) : ( */}
      <div
        style={{
          display: `${activatedNumber < 7 ? "" : "none"}`,
        }}
      >
        <Grid
          container
          spacing={2}
          // sx={{ mb: "20px" }}
          style={{ width: "100% !important", marginLeft: 0 }}
          className="container-my-pet step-start"
        >
          <Grid
            item
            xs={12}
            style={{ padding: 0 }}
            className="container-my-pet-2"
          >
            <SquareBox>
              <MainPetBox>
                <img
                  style={{
                    width: "75%",
                    margin: "auto",
                  }}
                  src="https://cdn.manekopet.xyz/pet-animations/states/0-1.gif"
                  alt="NFT"
                />
                <PetLifeTimeWrapper>
                  <Main className="step-02">
                    <img
                      src="assets/images2/ghost.svg"
                      width="16px"
                      style={{ marginRight: "8px" }}
                      alt="ghost"
                    />
                    20h15min55s
                  </Main>
                </PetLifeTimeWrapper>
                <PetPoos>
                  <img src="assets/images/my-pet-poo.png" alt="poo" />
                  <img src="assets/images/my-pet-poo.png" alt="poo" />
                  <img
                    src="assets/images/my-pet-poo.png"
                    alt="poo"
                    className="step-03"
                  />
                </PetPoos>
                <PetVolume>
                  <Volume />
                </PetVolume>
              </MainPetBox>
            </SquareBox>
          </Grid>
        </Grid>
        <div style={{ display: "flex" }}>
          <div
            className="wrap-feeding-item step-01"
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 15,
              marginTop: 30,
              width: "80%",
            }}
          >
            <Grid
              container
              spacing={2}
              style={{ margin: 0, display: "contents" }}
              columns={16}
              // sx={{ mb: "20px", mt: "20px" }}
            >
              <Grid item xs={4} style={{ padding: 0 }}>
                <SquareBox>
                  <Food>
                    <img
                      src="https://cdn.manekopet.xyz/images/shop/rice.png"
                      alt="Spirit Rice Ball"
                    />
                  </Food>
                </SquareBox>
              </Grid>
              <Grid item xs={4} style={{ padding: 0 }}>
                <SquareBox>
                  <Food>
                    <img
                      src="https://cdn.manekopet.xyz/images/shop/sakura.png"
                      alt="Sakura Jelly"
                    />
                  </Food>
                </SquareBox>
              </Grid>
              <Grid item xs={4} style={{ padding: 0 }}>
                <SquareBox>
                  <Food>
                    <img
                      src="https://cdn.manekopet.xyz/images/shop/fish.png"
                      alt="Koi Nibble"
                    />
                  </Food>
                </SquareBox>
              </Grid>
              <Grid item xs={4} style={{ padding: 0 }}>
                <SquareBox>
                  <Food>
                    <img
                      src="https://cdn.manekopet.xyz/images/shop/goldensake.png"
                      alt="Golden Sake"
                    />
                  </Food>
                </SquareBox>
              </Grid>
            </Grid>
          </div>
          <div
            className="wrap-feeding-item"
            style={{
              display: "flex",
              marginTop: 30,
              width: "17%",
              marginLeft: 10,
            }}
          >
            <Grid
              container
              spacing={2}
              style={{ margin: 0 }}
              columns={4}
              className="step-04"
              // sx={{ mb: "20px", mt: "20px" }}
            >
              <Grid item xs={4} style={{ padding: 0 }}>
                <SquareBox>
                  <Food>
                    <img
                      src="https://cdn.manekopet.xyz/images/shop/clean.png"
                      alt="Zen Cleanse"
                    />
                  </Food>
                </SquareBox>
              </Grid>
            </Grid>
          </div>
        </div>
        <div
          className="wrap-feeding-item"
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 15,
            marginTop: 30,
          }}
        >
          <Grid
            container
            spacing={2}
            style={{ margin: 0, display: "contents" }}
            columns={16}
            sx={{ mb: "20px" }}
          >
            <Grid item xs={4} style={{ padding: 0 }}>
              <SquareBox>
                <Menu>
                  <img src="assets/images/b-item-1.png" alt="achievements" />
                </Menu>
              </SquareBox>
            </Grid>
            <Grid item xs={4} className="step-05" style={{ padding: 0 }}>
              <SquareBox>
                <Menu>
                  <img src="assets/images/b-item-2.png" alt="spin the wheel" />
                </Menu>
              </SquareBox>
            </Grid>
            <Grid item xs={4} style={{ padding: 0 }}>
              <SquareBox>
                <Menu>
                  <img src="assets/images/b-item-3.png" alt="dice" />
                </Menu>
              </SquareBox>
            </Grid>
            <Grid item xs={4} style={{ padding: 0 }} className="step-06">
              <SquareBox>
                <Menu>
                  <img src="assets/images/b-item-4.png" alt="shop" />
                </Menu>
              </SquareBox>
            </Grid>
          </Grid>
        </div>
        <FeedMention style={{ marginTop: 25 }}>
          <FeedMentionGroup1>
            <b>Feed 1 Rice Bow!</b>
            <span>100 points and +1 day till starve</span>
          </FeedMentionGroup1>
          <FeedMentionGroup2>
            <b>10 MGEM</b>
          </FeedMentionGroup2>
        </FeedMention>
      </div>
      {/* )} */}
    </MainContent>
  );
};

export default Guide;

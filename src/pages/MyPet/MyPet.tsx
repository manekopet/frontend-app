import * as authApi from "@/apis/auth";
import * as nftPetApi from "@/apis/nft-pet";
import { ReactComponent as LevelUpgradeIcon } from "@/assets/svg/level-upgrade.svg";
import Loader from "@/components/Loader";
import PetLifeTime from "@/components/PetLifeTime";
import ContentBorderWrapper from "@/components/presentation/ContentBorderWrapper";
import { MainContent } from "@/components/presentation/MainContent";
import { useDispatch, useSelector } from "@/hooks/redux";
import useAudios from "@/hooks/useAudios";
import useBurnNft from "@/hooks/useBurnNft";
import useBuyItem from "@/hooks/useBuyItem";
import useMintNft from "@/hooks/useMintNft";
import useTokens from "@/hooks/useTokens";
import useWindowDimensions from "@/hooks/useWindowDimensions";
import { AuthContext } from "@/providers/AuthProvider";
import { appSelectors } from "@/redux/features/app/selectors";
import appSlice from "@/redux/features/app/slice";
import { logoutAsync } from "@/redux/features/auth/saga";
import { authSelector } from "@/redux/features/auth/selectors";
import authSlice from "@/redux/features/auth/slice";
import { petSelectors } from "@/redux/features/pet/selectors";
import petSlice from "@/redux/features/pet/slice";
import { GlobalConfig, GlobalFeedItem } from "@/types/app";
import { MenuItem } from "@/types/common";
import { getErrorMessage } from "@/types/error";
import { Pet, PetState, PetStatusLive, PetWithState } from "@/types/pet";
import { ERROR_WALLET } from "@/utils/constants";
import { balanceDisplayer, convertTokenDecimals } from "@/utils/convert";
import { NUMBER_REGEX } from "@/utils/regex";
import useAnalyticsEventTracker from "@/utils/useAnalyticsEventTracker";
import * as amplitude from "@amplitude/analytics-browser";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  AppBar,
  Button,
  Grid,
  IconButton,
  Toolbar,
  styled,
} from "@mui/material";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import TextField from "@mui/material/TextField";
import moment from "moment";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import HeaderProfile from "../../components/HeaderProfile";
import HeaderWallet from "../../components/HeaderWallet";
import FlexGrow from "../../components/presentation/FlexGrow";
import SquareBox from "../../components/presentation/SquareBox";
import {
  ActionButton,
  AnimatedMainPet,
  AnimatedMainPetBackground,
  AnimatedMainPetBushes1,
  AnimatedMainPetBushes2,
  AnimatedMainPetCloud,
  AnimatedMainPetCloud2,
  AnimatedMainPetEatingBattery,
  AnimatedMainPetFence,
  AnimatedMainPetHouse,
  AnimatedMainPetObstacle,
  AnimatedMainPetPoo,
  AnimatedMainPetStreet,
  AvatarIconButton,
  ContentBorderWrapperMain,
  ContentPriceMint,
  FeedMention,
  FeedMentionGroup1,
  FeedMentionGroup2,
  Food,
  LeaderboardInfo,
  LevelModalBox,
  LevelModalContent,
  LevelModalTitle,
  LevelUpgradeText,
  MainPetBox,
  MainPetWrapper,
  Menu,
  MintAnimatedMainPet,
  PetBox,
  PetLevelUpgrade,
  PetLifeTimeWrapper,
  PetPoos,
  PetProfile,
  PetProfileName,
  PetProfilePoints,
  PetShield,
  StepContainer,
  StepDescriptionMain,
  SwapInputBoxInput,
} from "./MyPet.styled";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "400px",
  bgcolor: "background.paper",
  border: "2px solid #000",
  borderRadius: "5px",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const Rewards = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "16px",
}));

const RewardsCoinGroup = styled(Box)(() => ({
  background: "#FFF",
  boxShadow: "1px 1px 0px 0px #0D1615",
  color: "#0D1615",
  borderRadius: "10px",
  border: "1px solid #0D1615",
  padding: "12px 15px",
  display: "flex",
  width: "35%",
  flexDirection: "column",
}));

const RewardsCoinGroupAmount = styled(Box)(() => ({
  fontSize: "14px",
  fontWeight: "500",
  lineHeight: "18px",
  letterSpacing: "0.07px",
  display: "flex",
  alignitems: "center",

  "& svg": {
    marginRight: "4px",
  },
}));

const menus: MenuItem[] = [
  {
    name: "achievements",
    href: "/achievements",
    image: "assets/images2/mypet-archievements.svg",
  },
  {
    name: "arcades",
    href: "/arcades",
    image: "assets/images2/mypet-arcades.svg",
  },
  // {
  //   name: "refer-and-earn",
  //   href: "/refer-and-earn",
  //   image: "assets/images2/mypet-photo.svg",
  // },
  {
    name: "daily-rewards",
    href: "/daily-rewards",
    image: "assets/images2/mypet-daily-rewards.png",
  },
  {
    name: "shop",
    image: "assets/images2/mypet-shop.svg",
    href: "/shop",
  },
];

const Page: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { buyItem } = useBuyItem();
  const { onBurn } = useBurnNft();
  const { web3auth: web3AuthGlobal, logout: logoutWallet } =
    useContext(AuthContext);
  const [showModalEditPetName, setShowModalEditPetName] = useState(false);
  const [openLevelModal, setOpenLevelModal] = useState(false);
  const [feedItem, setFeedItem] = useState<GlobalFeedItem | null>(null);
  const [isFeeding, setIsFeeding] = useState<boolean>(false);
  const levelRef = useRef<HTMLSpanElement>(null);
  const levelTextRef = useRef<HTMLSpanElement>(null);
  const [hideLevelTextWidth, setHideLevelTextWidth] = useState<number>(0);
  const [hideLevelText, setHideLevelText] = useState<boolean>(true);
  const [isLevelLoading, setIsLevelLoading] = useState<boolean>(false);
  const authState = useSelector(authSelector.selectorDomain);
  const { onMintNft, isMinting } = useMintNft();
  const [openSideBar, setOpenSideBar] = useState(false);
  const activePet = useSelector(petSelectors.selectActivePet);
  console.log("active", activePet);
  const pets = useSelector(petSelectors.selectPets);
  const [firstLoading, setFirstLoading] = useState(pets.length > 0);
  const global = useSelector<GlobalConfig | null>(appSelectors.selectGlobal);
  const feedItems = useSelector(appSelectors.selectFeedItems);
  const [mainPetState, setMainPetState] = useState<PetState>(
    activePet && activePet.petState ? activePet.petState : PetState.IDLE
  );
  const { levelUp } = useAudios();

  const [newNamePet, setNewNamePet] = useState(
    activePet ? activePet.pet?.name : ""
  );
  const shoppingVaultAddress = useSelector(
    appSelectors.selectShoppingVaultAddress
  );
  const { gemToken } = useTokens();
  const windowDimensions = useWindowDimensions();
  const [isCleaning, setIsCleaning] = useState(false);
  const foodRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const mainPetWrapperRef = useRef<HTMLDivElement>(null);

  const nextLevel = activePet?.pet?.petLevel ? activePet?.pet?.petLevel + 1 : 2;
  const mainPetEquip = activePet?.petEquip || undefined;

  const needRevival =
    activePet &&
    (activePet.pet?.statusLive === 2 || activePet.pet?.statusLive === 3);

  const feeds = useMemo(() => {
    const list = [...(feedItems || [])];
    if (list.length > 4) {
      const reverse = list.slice(0, 4);
      const last = list.slice(4);
      const data = reverse.sort((a, b) => a.itemPoints - b.itemPoints);
      return [...data, ...last];
    }
    return feedItems || [];
  }, [feedItems]);

  const handleChange = (e: any) => {
    setNewNamePet(e.target.value);
  };

  const gaEventTracker = useAnalyticsEventTracker("My Pet");

  const fetchActivePet = async (nftId: string) => {
    // Get pet active
    const pet: PetWithState = await nftPetApi.getMyPetFeed(nftId);
    dispatch(petSlice.actions.activePet({ pet }));
    console.log("active pet", pet);
    pet.petState && setMainPetState(pet.petState);
    setNewNamePet(pet.pet?.name);
  };

  const fetchPets = async () => {
    try {
      // Get list my pet
      const pets: Pet[] = await nftPetApi.getMyPets();
      if (pets.length > 0) {
        dispatch(petSlice.actions.setPets({ pets }));

        // Get pet active
        fetchActivePet(activePet ? activePet.pet?.nftId : pets[0].nftId);
      }
    } catch (e: any) {
      console.log("Not found NFTs.");
    } finally {
      setTimeout(() => {
        setFirstLoading(true);
      }, 1000);
    }
  };
  useEffect(() => {
    console.log("authState?.isJustMint: ", authState?.isJustMint);
    if (authState?.isJustMint && pets.length < 2) {
      dispatch(authSlice.actions.setIsJustMint(false));
      navigate("/guide");
    } else {
      dispatch(authSlice.actions.setIsJustMint(false));
    }
  }, [authState?.isJustMint]);

  useEffect(() => {
    if (!firstLoading || pets.length === 0) {
      fetchPets();
    }
  }, [firstLoading]);

  useEffect(() => {
    gaEventTracker("view_main", "view_main");
    amplitude.track("view_main");
    if (activePet) {
      fetchActivePet(activePet?.pet?.nftId);
      // }
    }
  }, []);

  useEffect(() => {
    if (activePet && hideLevelTextWidth > 0) {
      if (
        (activePet.pet.petScore || 0) > calculatePointsToNextLevel(nextLevel)
      ) {
        setHideLevelText(false);
        setTimeout(() => {
          setHideLevelText(true);
        }, 5000);
      }
    }
  }, [activePet, hideLevelTextWidth]);

  useEffect(() => {
    if (
      levelRef.current !== null &&
      levelTextRef.current !== null &&
      hideLevelTextWidth === 0
    ) {
      const levelWidth = levelRef.current.clientWidth;
      const levelTextWidth = levelTextRef.current.clientWidth;
      setHideLevelTextWidth(levelWidth - levelTextWidth - 8);
    }
  }, [levelRef.current, levelTextRef.current]);

  const handleClickFood = (f: GlobalFeedItem) => {
    return async () => {
      setFeedItem(f);
    };
  };

  const handleFeed = async () => {
    if (activePet && feedItem) {
      if (activePet.pet?.statusLive === PetStatusLive.Death) {
        return;
      }
      if (isFeeding) {
        return;
      }
      amplitude.track("feeding_started");
      gaEventTracker("feeding_started", "feeding_started");
      const toastId = toast.loading("Feeding...");
      setIsFeeding(true);
      try {
        const { order } = await nftPetApi.shoppingNew(
          activePet.pet?.nftPublicKey,
          activePet.pet?.nftId,
          feedItem.itemId
        );
        const profile: any = await authApi.getProfile();
        dispatch(
          authSlice.actions.loginSuccess({
            accessToken: window.token,
            user: profile?.user,
            balance: profile?.balance,
            socialData: profile?.socialdata,
          })
        );
        // const buyItemResp = await buyItem(
        //   `${shoppingVaultAddress}`,
        //   order.itemPrice,
        //   `${order.itemOrderId}`,
        //   `${feedItem.itemId}`,
        //   activePet.pet?.nftId
        // );
        // if (buyItemResp) {
        // const { order: updatedOrder } = await nftPetApi.shoppingUpdate(
        //   // buyItemResp.signature,
        //   order.itemOrderId
        // );
        if (order) {
          //
          if (feedItem.itemAnimationAction) {
            const audio = new Audio(feedItem.itemSoundAction);

            const { petLevel } = activePet;
            let animationImage = feedItem.itemAnimationAction;
            if (animationImage.indexOf("{ageLevel}") !== -1) {
              animationImage = feedItem.itemAnimationAction.replace(
                "{ageLevel}",
                `${petLevel.AgeLevel}`
              );
            }

            audio.play();
            if (feedItem.itemId === 1005) {
              setIsCleaning(true);
            } else {
              setMainPetState(PetState.EATING);
            }

            setTimeout(async () => {
              audio.pause();

              let points = feedItem.itemPoints;
              if (points > 0) {
                dispatch(
                  appSlice.actions.showRewardModal({
                    points: points,
                    symbol: "PTS",
                  })
                );
              }

              // Get pet active
              const pet: PetWithState = await nftPetApi.getMyPetFeed(
                activePet ? activePet.pet?.nftId : pets[0].nftId
              );
              dispatch(petSlice.actions.activePet({ pet }));
              if (feedItem.itemId === 1005) {
                setIsCleaning(false);
              } else {
                pet.petState && setMainPetState(pet.petState);
              }
              setNewNamePet(pet.pet?.name);
            }, 5000);
          }
          gaEventTracker("feeding_success", "feeding_success");
          amplitude.track("feeding_success");
        }
        // } else {
        //   gaEventTracker("feeding_fail_error", "feeding_fail_error");
        //   amplitude.track("feeding_fail_error");
        // }
      } catch (error: any) {
        gaEventTracker("feeding_fail_error", "feeding_fail_error");
        amplitude.track("feeding_fail_error");
        const message = getErrorMessage(error);
        if (message === ERROR_WALLET.UninitializedWalletAdapterError) {
          logoutWallet();
        }
        toast.error(message);
        if (message === "Your balance is insufficient") {
          navigate("/wallet/deposit");
        }
      } finally {
        toast.dismiss(toastId);
        setIsFeeding(false);
      }
    }
  };

  const handleBurn = async () => {
    if (activePet && activePet.pet?.statusLive === PetStatusLive.Death) {
      const toastId = toast.loading("Burning...");
      try {
        await onBurn(activePet.pet?.nftPublicKey);
        if (pets.length > 1) {
          const removedPets = pets.filter(
            (p) => p.nftPublicKey !== activePet.pet?.nftPublicKey
          );
          fetchActivePet(removedPets[0].nftId);
        }

        petSlice.actions.removePet(activePet.pet?.nftPublicKey);
        setTimeout(() => {
          fetchPets();
        }, 3000);
      } catch (e: any) {
        console.log(e);
        toast("Burn failed");
      } finally {
        toast.dismiss(toastId);
      }
    }
  };

  const handleClickMenu = (m: MenuItem) => {
    return () => {
      navigate(m.href);
    };
  };
  const toggleDrawer =
    (anchor: any, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setOpenSideBar(!openSideBar);
    };

  const handleClickChooseNft = async (pet: Pet) => {
    // Get list my pet
    try {
      // Get pet active
      const petWithState: PetWithState = await nftPetApi.getMyPetFeed(
        pet.nftId
      );
      dispatch(petSlice.actions.activePet({ pet: petWithState }));
      if (petWithState.petState) {
        setMainPetState(petWithState.petState);
      }
      setNewNamePet(petWithState.pet?.name);
      toggleDrawer("left", false);
      setOpenSideBar(false);
    } catch (e) {
      console.log(e);
    }
  };

  const renderActionButton = (item: any) => {
    if (activePet && item.nftPublicKey === activePet.pet?.nftPublicKey) {
      return (
        <ActionButton sx={{ width: "70px" }} color="primary">
          Selected
        </ActionButton>
      );
    }
    return (
      <ActionButton
        color="secondary"
        sx={{ width: "70px" }}
        onClick={() => handleClickChooseNft(item)}
      >
        Choose
      </ActionButton>
    );
  };

  const renderList = () => (
    <Box sx={{ width: "100%" }} role="presentation">
      <MainContent>
        <AppBar position="relative">
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
            Your pets
            <FlexGrow />
            <HeaderWallet />
          </Toolbar>
        </AppBar>
        <ContentBorderWrapper sx={{ p: "20px" }}>
          <Grid container spacing={2} sx={{ mb: "20px" }}>
            {pets.map((item: Pet, idx: any) => {
              const isSelected =
                item.nftPublicKey === activePet?.pet?.nftPublicKey;
              return (
                <Grid item xs={12} key={`pet-${idx}`}>
                  <PetBox selected={isSelected}>
                    <AvatarIconButton sx={{ mr: "12px" }}>
                      <img
                        src={"assets/images/icon-pet.png"}
                        alt="pet"
                        style={{ width: "20px" }}
                      />
                    </AvatarIconButton>
                    <PetProfile>
                      <PetProfileName>
                        {`${item.name} (#${item.nftId})` || item.nftId}
                      </PetProfileName>
                      <PetProfilePoints>
                        {item.petScore.toFixed(2)} pts
                      </PetProfilePoints>
                    </PetProfile>
                    <Box>{renderActionButton(item)}</Box>
                  </PetBox>
                </Grid>
              );
            })}
          </Grid>
          <Button
            disabled={isMinting}
            onClick={onMintNft}
            fullWidth
            size="large"
          >
            {isMinting ? "MINTING" : "MINT"}
          </Button>
        </ContentBorderWrapper>
      </MainContent>
    </Box>
  );

  const handleClose = () => {
    setShowModalEditPetName(false);
  };

  const handleUplevel = async () => {
    setIsLevelLoading(true);
    const openAudio = levelUp.current;
    if (activePet) {
      if (newNamePet === "") {
        toast.error("Pet Name is required");
        return;
      }
      try {
        const result: any = await nftPetApi.levelUpPet(
          activePet.pet?.nftPublicKey,
          activePet.pet?.nftId
        );

        if (result?.status && result?.pet) {
          const pet: Pet = result?.pet;

          const petWithState: PetWithState = await nftPetApi.getMyPetFeed(
            pet.nftId
          );

          dispatch(petSlice.actions.activePet({ pet: petWithState }));
          toast.success(result?.message);
          fetchPets();
          openAudio.play();
        } else {
          toast.error(result?.message);
          setIsLevelLoading(false);
        }
      } catch (e: any) {
        console.log("Up level failed.");
        setIsLevelLoading(false);
      }
      setShowModalEditPetName(false);
    }
    setIsLevelLoading(false);
  };

  const updatePetName = async () => {
    if (activePet) {
      if (newNamePet === "") {
        toast.error("Pet Name is required");
        return;
      }
      try {
        const result: any = await nftPetApi.updatePetName(
          activePet.pet?.id,
          activePet.pet?.nftPublicKey,
          activePet.pet?.nftId,
          newNamePet
        );
        const pet: Pet = result?.pet;

        const petWithState: PetWithState = await nftPetApi.getMyPetFeed(
          pet.nftId
        );

        dispatch(petSlice.actions.activePet({ pet: petWithState }));
        toast.success(result?.message);
        fetchPets();
      } catch (e: any) {
        console.log("Not found NFTs.");
      }
      setShowModalEditPetName(false);
    }
  };

  const logout = async () => {
    if (!web3AuthGlobal) {
      console.log("web3auth not initialized yet");
      return;
    }
    if (!web3AuthGlobal.connected) {
      dispatch(authSlice.actions.setReferral(""));
      window.token = "";
      dispatch(logoutAsync());
      localStorage.removeItem("skipScreenInviteCode");
      return;
    }
    await web3AuthGlobal.logout();
    dispatch(authSlice.actions.setAccount({ account: {} }));
    dispatch(authSlice.actions.setReferral(""));
    dispatch(logoutAsync());
    window.token = "";
    navigate("/login");
  };

  const parseValueNumber = (value: string) => {
    return (value || "").replace(NUMBER_REGEX, "");
  };

  const renderMintBox = () => {
    return (
      <StepContainer>
        <StepDescriptionMain sx={{ mb: "10px" }}>
          Mint your Maneko Pet
        </StepDescriptionMain>
        <LeaderboardInfo>
          Mint a Maneko and unlock a world of joy and fortune.
          <br />
          Nurture your Maneko pet, engage in fun battles, and grow your fortune
          together.
        </LeaderboardInfo>
        <ContentBorderWrapperMain
          style={{ background: "rgb(252 247 244)", position: "relative" }}
          sx={{ mb: "20px", mt: "38px" }}
        >
          <MintAnimatedMainPet />
        </ContentBorderWrapperMain>
        <ContentPriceMint>
          <div className="content-price-left" style={{ textAlign: "left" }}>
            <p style={{ margin: 0, fontSize: "14px", fontWeight: 500 }}>
              Price
            </p>
            <p style={{ marginTop: 0, fontSize: "12px", fontWeight: 500 }}>
              {global?.mintPrice || 0} MGEM
            </p>
          </div>
          <div className="content-price-right" style={{ textAlign: "right" }}>
            <p style={{ margin: 0, fontSize: "14px", fontWeight: 500 }}>
              Your balance
            </p>
            <p style={{ marginTop: 0, fontSize: "12px", fontWeight: 500 }}>
              {balanceDisplayer(
                +convertTokenDecimals(gemToken.balance, gemToken.decimals)
              )}{" "}
              {gemToken.symbol.toUpperCase()}
            </p>
          </div>
        </ContentPriceMint>
        <Button
          disabled={isMinting}
          onClick={onMintNft}
          fullWidth
          size="large"
          sx={{ mb: "15px", mt: "30px" }}
        >
          {isMinting ? "MINTING" : "MINT MANEKO"}
        </Button>
      </StepContainer>
    );
  };

  const formatFeedTimeExtension = (itemTimeExtension: number) => {
    if (itemTimeExtension < 24) {
      return `${itemTimeExtension} hour${itemTimeExtension > 1 ? "s" : ""}`;
    }
    if (itemTimeExtension % 24 === 0) {
      return `${itemTimeExtension / 24} day${
        itemTimeExtension / 24 > 1 ? "s" : ""
      }`;
    }

    return `${itemTimeExtension / 24} day(${
      itemTimeExtension / 24 > 1 ? "s" : ""
    } ${itemTimeExtension % 24} hour${itemTimeExtension % 24 > 1 ? "s" : ""}`;
  };

  if (!firstLoading) {
    return <Loader />;
  }

  function calculatePointsToNextLevel(targetLevel: any) {
    const BASE_POINT = 500;
    let totalScore = 0;

    for (let level = 1; level < targetLevel; level++) {
      const nextLevelScore =
        BASE_POINT + Math.pow(BASE_POINT, Math.log10(level));
      totalScore += nextLevelScore;
    }

    return Math.round((totalScore * 10) / 10);
  }

  return (
    <MainContent>
      <Modal
        sx={{ position: "absolute" }}
        container={() => document.getElementById("main-app")}
        open={showModalEditPetName}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style, width: 400 }}>
          <h3 id="child-modal-title">Update Pet Name</h3>
          <p id="child-modal-description" className="warning-modal">
            <SwapInputBoxInput>
              <TextField
                className="input-pet-name"
                id="outlined-basic"
                value={newNamePet}
                onChange={handleChange}
              />
            </SwapInputBoxInput>
          </p>
          <Button style={{ width: "100%" }} onClick={() => updatePetName()}>
            Save
          </Button>
        </Box>
      </Modal>
      <AppBar position="relative">
        <Toolbar disableGutters>
          <AvatarIconButton
            sx={{ mr: "12px" }}
            onClick={toggleDrawer("left", true)}
          >
            <img
              src={"assets/images/icon-pet.png"}
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
      <SwipeableDrawer
        anchor={"left"}
        open={openSideBar}
        onClose={toggleDrawer("left", false)}
        onOpen={toggleDrawer("left", true)}
        ModalProps={{ container: () => document.getElementById("main-app") }}
        sx={{
          position: "absolute",
          "& > .MuiPaper-root": {
            position: "absolute",
          },
        }}
        className="side-bar-pet"
      >
        {renderList()}
      </SwipeableDrawer>
      <Grid
        container
        spacing={2}
        sx={{ mb: "20px" }}
        className="container-my-pet"
      >
        <Grid item xs={12}>
          {activePet ? (
            <MainPetWrapper
              ref={mainPetWrapperRef}
              screenHeight={windowDimensions.height}
              foodRef={foodRef}
              menuRef={menuRef}
            >
              <PetLifeTimeWrapper>
                <PetLifeTime />
              </PetLifeTimeWrapper>
              <MainPetBox>
                {/* {activePet.petImage && (
                  <img src={mainPetImage} alt={activePet.pet?.name} />
                )} */}
                {moment(activePet.pet?.shieldExpiredIn).isAfter(moment()) && (
                  <PetShield />
                )}
                <PetLevelUpgrade
                  ref={levelRef}
                  sx={{
                    maxWidth:
                      hideLevelText && hideLevelTextWidth > 0
                        ? `${hideLevelTextWidth}px`
                        : "100%",
                    opacity: hideLevelTextWidth > 0 ? 1 : 0,
                  }}
                  onClick={() => setOpenLevelModal(true)}
                >
                  LV {activePet.pet?.petLevel}
                  <LevelUpgradeIcon style={{ verticalAlign: "bottom" }} />{" "}
                  <LevelUpgradeText ref={levelTextRef}>
                    {`Upgrade for ${balanceDisplayer(
                      calculatePointsToNextLevel(nextLevel),
                      2
                    )} PTS`}
                  </LevelUpgradeText>
                </PetLevelUpgrade>
                <PetPoos>
                  {/* {[...Array(activePet.poo)].map(() => (
                    <AnimatedMainPetPoo
                      screenWidth={windowDimensions.width < 500 ? windowDimensions.width: 500}
                      clean={isCleaning}
                    />
                  ))} */}

                  {activePet.poo > 0 && (
                    <AnimatedMainPetPoo
                      screenWidth={
                        windowDimensions.width < 500
                          ? windowDimensions.width
                          : 500
                      }
                      clean={isCleaning}
                    />
                  )}
                </PetPoos>

                {activePet && (
                  <AnimatedMainPet
                    hasPoo={activePet.poo > 0}
                    state={mainPetState}
                    equip={mainPetEquip}
                    equipAnimated={activePet.petEquipAnimatedImage}
                    screenWidth={
                      windowDimensions.width < 500
                        ? windowDimensions.width
                        : 500
                    }
                  />
                )}
                <AnimatedMainPetBackground wrapperRef={mainPetWrapperRef} />
                <AnimatedMainPetHouse
                  screenWidth={
                    windowDimensions.width < 500 ? windowDimensions.width : 500
                  }
                />
                <AnimatedMainPetBushes1
                  screenWidth={
                    windowDimensions.width < 500 ? windowDimensions.width : 500
                  }
                />
                <AnimatedMainPetBushes2
                  screenWidth={
                    windowDimensions.width < 500 ? windowDimensions.width : 500
                  }
                />
                <AnimatedMainPetCloud
                  screenWidth={
                    windowDimensions.width < 500 ? windowDimensions.width : 500
                  }
                />
                <AnimatedMainPetCloud2
                  screenWidth={
                    windowDimensions.width < 500 ? windowDimensions.width : 500
                  }
                />
                <AnimatedMainPetFence
                  screenWidth={
                    windowDimensions.width < 500 ? windowDimensions.width : 500
                  }
                />
                <AnimatedMainPetObstacle
                  screenWidth={
                    windowDimensions.width < 500 ? windowDimensions.width : 500
                  }
                />
                <AnimatedMainPetStreet />
                <AnimatedMainPetEatingBattery
                  hasPoo={activePet.poo > 0}
                  state={mainPetState}
                />
              </MainPetBox>
            </MainPetWrapper>
          ) : (
            renderMintBox()
          )}

          <Modal
            sx={{ position: "absolute" }}
            container={() => document.getElementById("main-app")}
            onClose={() => setOpenLevelModal(false)}
            open={openLevelModal}
          >
            <LevelModalBox>
              <LevelModalTitle>
                <img
                  style={{ width: "40%" }}
                  src="/assets/images/level-up.gif"
                  alt="loading..."
                />
              </LevelModalTitle>
              <LevelModalContent>
                <Rewards>
                  <RewardsCoinGroup>
                    <RewardsCoinGroupAmount>
                      LV {activePet?.pet?.petLevel || 1}
                    </RewardsCoinGroupAmount>
                  </RewardsCoinGroup>
                  <IconButton size="small" sx={{ backgroundColor: "#fff" }}>
                    <ChevronRightIcon />
                  </IconButton>
                  <RewardsCoinGroup>
                    <RewardsCoinGroupAmount>
                      LV {nextLevel}
                    </RewardsCoinGroupAmount>
                  </RewardsCoinGroup>
                </Rewards>
              </LevelModalContent>
              <Button
                disabled={
                  isLevelLoading ||
                  (activePet?.pet?.petScore || 0) <
                    calculatePointsToNextLevel(nextLevel)
                }
                // sx={{ px: 5, py: 1 }}
                style={{ fontSize: "13px" }}
                onClick={handleUplevel}
              >
                Upgrade for{" "}
                {balanceDisplayer(calculatePointsToNextLevel(nextLevel), 2)} PTS
              </Button>
            </LevelModalBox>
          </Modal>
        </Grid>
      </Grid>
      {activePet && (
        <>
          <Grid
            ref={foodRef}
            container
            spacing={2}
            columns={20}
            sx={{ mb: "20px" }}
          >
            {feeds.length > 0 &&
              feeds.map((f, idx) => (
                <Grid item xs={4} key={`food-${idx}`}>
                  <SquareBox>
                    <Food
                      selected={feedItem?.itemId === f.itemId}
                      onClick={handleClickFood(f)}
                    >
                      <img src={f.itemImage} alt={f.itemName} />
                    </Food>
                  </SquareBox>
                </Grid>
              ))}
          </Grid>
          <Grid ref={menuRef} container spacing={2} sx={{ mb: "20px" }}>
            {menus.map((m, idx) => (
              <Grid item xs key={`menu-${idx}`}>
                <SquareBox>
                  <Menu onClick={handleClickMenu(m)}>
                    <img src={m.image} alt={m.name} />
                  </Menu>
                </SquareBox>
              </Grid>
            ))}
          </Grid>
          {activePet.pet?.statusLive !== PetStatusLive.Death && feedItem && (
            <FeedMention onClick={handleFeed}>
              <FeedMentionGroup1>
                <b>
                  Feed 1 {feedItem.itemName}{" "}
                  {activePet &&
                  (activePet.pet?.statusLive === 2 ||
                    activePet.pet?.statusLive === 3)
                    ? `+ Revival`
                    : ""}
                </b>
                <span>
                  {feedItem.itemPoints} points and{" "}
                  {formatFeedTimeExtension(feedItem.itemTimeExtension)} till
                  starve
                </span>
              </FeedMentionGroup1>
              <FeedMentionGroup2>
                <b>
                  {(feedItem.itemPrice +
                    (needRevival ? global?.revealPrice || 0 : 0)) /
                    10 ** 9}{" "}
                  MGEM
                </b>
              </FeedMentionGroup2>
            </FeedMention>
          )}
          {activePet.pet?.statusLive === PetStatusLive.Death && (
            <FeedMention onClick={handleBurn}>
              <FeedMentionGroup1>
                <b>Burn pet</b>
                <span>Auto-sell items, receive funds in wallet</span>
              </FeedMentionGroup1>
            </FeedMention>
          )}
        </>
      )}
    </MainContent>
  );
};

export default Page;

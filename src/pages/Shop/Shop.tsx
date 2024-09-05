import * as authApi from "@/apis/auth";
import * as nftPetApi from "@/apis/nft-pet";

import * as publicApi from "@/apis/public";
import { MainContent } from "@/components/presentation/MainContent";
import { useDispatch, useSelector } from "@/hooks/redux";
import useBuyItem from "@/hooks/useBuyItem";
import useWindowDimensions from "@/hooks/useWindowDimensions";
import { AuthContext } from "@/providers/AuthProvider";
import { appSelectors } from "@/redux/features/app/selectors";
import appSlice from "@/redux/features/app/slice";
import authSlice from "@/redux/features/auth/slice";
import { petSelectors } from "@/redux/features/pet/selectors";
import petSlice from "@/redux/features/pet/slice";
import { GlobalFeedItem } from "@/types/app";
import { getErrorMessage } from "@/types/error";
import { Pet, PetWithState } from "@/types/pet";
import { ERROR_WALLET } from "@/utils/constants";
import useAnalyticsEventTracker from "@/utils/useAnalyticsEventTracker";
import * as amplitude from "@amplitude/analytics-browser";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import {
  AppBar,
  Box,
  BoxProps,
  Button,
  Grid,
  IconButton,
  Switch,
  SwitchProps,
  Toolbar,
  styled,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import HeaderWallet from "../../components/HeaderWallet";
import ContentBorderWrapper from "../../components/presentation/ContentBorderWrapper";
import FlexGrow from "../../components/presentation/FlexGrow";
import Mention from "../../components/presentation/Mention";
import SquareBox from "../../components/presentation/SquareBox";

const Character = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
}));

const ItemInfo = styled(Box)(() => ({
  flexGrow: 1,
}));
const CharacterName = styled(Box)(() => ({
  textAlign: "center",
  display: "flex",
  alignItems: "center",
  padding: "10px",
  fontWeight: "500",
  fontSize: "16px",
  lineHeight: "20px",
  letterSpacing: "0.07px",
}));

const CharacterAttribute = styled(Box)(() => ({
  display: "flex",
  marginBottom: "15px",
  alignItems: "center",
  justifyContent: "center",
  "& b": {
    fontWeight: "700",
  },
}));

const CharacterAttributeLabel = styled(Box)(() => ({
  fontWeight: "400",
  fontSize: "12px",
  lineHeight: "15px",
  letterSpacing: "0.07px",
  flexGrow: "1",
}));

const CharacterAttributeValue = styled(Box)(() => ({
  fontWeight: "400",
  fontSize: "12px",
  lineHeight: "15px",
  letterSpacing: "0.07px",
}));

const CharacterImage = styled(Box)(() => ({
  alignItems: "center",
  justifyContent: "center",
  display: "flex",
  height: "100%",
  minWidth: "150px",

  "& img": {
    maxHeight: "160px",
  },
}));

const IOSSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#65C466",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

interface ShopItemProps extends BoxProps {
  selected?: boolean;
}

export const ShopItem = styled(Box, {
  shouldForwardProp: (prop) => prop !== "selected",
})<ShopItemProps>(({ selected }) => ({
  borderRadius: "10px",
  display: "flex",
  width: "100%",
  height: "100%",
  justifyContent: "center",
  alignItems: "center",
  border: "1px solid rgba(13, 22, 21, 1)",
  boxShadow: "1px 1px 0px 0px rgba(13, 22, 21, 1)",
  background: selected ? "#FFEBC0" : "#FFF",
  "& img": {
    width: "70%",
    maxHeight: "80px",
  },
}));

export const AnimatedMainPet = styled(Box, {
  shouldForwardProp: (prop: string) =>
    ["equip", "equipImage"].indexOf(prop) === -1,
})<{
  equip: number;
  equipImage: string;
}>(({ equip, equipImage }) => {
  // 53x43
  const petWidth = 150;
  const petHeight = petWidth * (43 / 53);

  const activeStageCount = 8;

  return {
    position: "absolute",
    height: `${petHeight}px`,
    width: `calc(${petWidth * activeStageCount}px / ${activeStageCount})`,
    background: `url(${equipImage})`,
    backgroundSize: "auto 100%",
    animation: `animateMainPet-${equip} ${
      activeStageCount / 8
    }s steps(${activeStageCount}) infinite`,
    zIndex: 100,
    imageRendering: "pixelated",

    [`@keyframes animateMainPet-${equip}`]: {
      from: {
        backgroundPosition: 0,
      },
      to: {
        backgroundPosition: `-${petWidth * activeStageCount}px`,
      },
    },
  };
});

export const PetShield = styled(Box)(() => ({
  position: "absolute",
  top: "-20px",
  left: "10px",
  width: "35px",
  zIndex: 999,
  height: "46px",
  background: "url(assets/images2/shield.svg) no-repeat",
  backgroundSize: "cover",
}));

export const ItemsBox = styled(Box)(() => ({
  width: "100%",
  overflow: "auto",
}));

const Page: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const shopItems = useSelector(appSelectors.selectShopItems);
  const activePet = useSelector(petSelectors.selectActivePet);
  const shoppingVaultAddress = useSelector(
    appSelectors.selectShoppingVaultAddress
  );
  const [shopItem, setShopItem] = useState<GlobalFeedItem | null>(
    shopItems ? shopItems[0] : null
  );
  const [shopItemAsMain, setShopItemAsMain] = useState<boolean>(false);
  const { buyItem } = useBuyItem();
  const { logout } = useContext(AuthContext);
  const gaEventTracker = useAnalyticsEventTracker("Shop");
  const windowDimensions = useWindowDimensions();

  const handleBack = () => {
    navigate("/my-pet");
  };

  const handleClickShopItem = (item: GlobalFeedItem) => {
    return async () => {
      // if (shopItem && shopItem.itemId === item.itemId) {
      //   setShopItem(null);
      //   setShopItemAsMain(
      //     !!activePet?.petItems.find((i) => i.itemId === item.itemId)
      //       ?.itemAsMain || false
      //   );
      //   setShopPreviewImage(activePet?.pet?.image || "");
      // } else {
      setShopItem(item);
      setShopItemAsMain(
        !!activePet?.petItems.find((i) => i.itemId === item.itemId)
          ?.itemAsMain || false
      );
      // }
    };
  };

  const postActionAfterBuySell = async () => {
    try {
      fetchActivePet();
      fetchGlobal();
    } catch (e) {
      console.log(e);
    }
  };

  const handleBuy = async () => {
    gaEventTracker("item_trade_started", "item_trade_started");
    amplitude.track("item_trade_started");
    const toastId = toast.loading("Buying...");
    try {
      if (shopItem && activePet) {
        const { order } = await nftPetApi.shoppingNew(
          activePet.pet?.nftPublicKey,
          activePet.pet?.nftId,
          shopItem.itemId
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
        //   shopItem.itemPrice,
        //   `${order.itemOrderId}`,
        //   `${shopItem.itemId}`,
        //   activePet.pet?.nftId
        // );
        // if (buyItemResp) {
        const retryUpdate = async () => {
          try {
            const { order: updatedOrder } = await nftPetApi.shoppingUpdate(
              // buyItemResp.signature,
              order.itemOrderId
            );

            if (updatedOrder) {
              gaEventTracker("item_trade_success", "item_trade_success");
              amplitude.track("item_trade_success");
              toast("Buy success");

              postActionAfterBuySell();
            } else {
              retryUpdate();
            }
          } catch (e) {
            gaEventTracker("item_trade_fail", "item_trade_fail");
            amplitude.track("item_trade_fail");
            console.log("shopping update failed", e);
            retryUpdate();
          }
        };

        await retryUpdate();
        // }
      }
    } catch (error: any) {
      const message = getErrorMessage(error);
      if (message === ERROR_WALLET.UninitializedWalletAdapterError) {
        logout();
      }
      toast.error(message);
      if (message === "Your balance is insufficient") {
        navigate("/wallet/deposit");
      }
    } finally {
      toast.dismiss(toastId);
    }
  };

  const handleSell = async () => {
    gaEventTracker("item_trade_started", "item_trade_started");
    amplitude.track("item_trade_started");
    const toastId = toast.loading("Selling...");
    try {
      if (shopItem && activePet) {
        const { item } = await nftPetApi.shoppingSell(
          activePet.pet?.nftId,
          shopItem.itemId
        );
        if (item) {
          toast("Sell success");
          gaEventTracker("item_trade_success", "item_trade_success");
          amplitude.track("item_trade_success");
          postActionAfterBuySell();
        }
      }
    } catch (e: any) {
      gaEventTracker("item_trade_fail", "item_trade_fail");
      amplitude.track("item_trade_fail");
      console.log(e);
      toast("Sell failed");
    } finally {
      toast.dismiss(toastId);
    }
  };

  const handleSetAsMain = async () => {
    const toastId = toast.loading("Equiping...");
    try {
      if (shopItem && activePet) {
        const { item } = await nftPetApi.shoppingSetAsMain(
          activePet.pet?.nftId,
          shopItem.itemId
        );
        if (item) {
          toast("Equip success");
          setShopItemAsMain(true);
          postActionAfterBuySell();
        }
      }
    } catch (e: any) {
      console.log(e);
      toast("Set as main failed");
    } finally {
      toast.dismiss(toastId);
    }
  };

  const renderShopButton = () => {
    if (!shopItem) {
      return null;
    }
    if (shopItem.itemIsSellable) {
      const owned =
        activePet?.petItems.find((i) => i.itemId === shopItem.itemId)
          ?.balance || 0;
      if (owned === 0) {
        return (
          <Grid item xs={12}>
            <Button size="large" fullWidth onClick={handleBuy}>
              BUY
            </Button>
          </Grid>
        );
      }
      return (
        <>
          <Grid item xs={6}>
            <Button size="large" fullWidth onClick={handleSell}>
              SELL
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button size="large" fullWidth onClick={handleBuy}>
              BUY
            </Button>
          </Grid>
        </>
      );
    }
    return (
      <Grid item xs={12}>
        <Button size="large" fullWidth onClick={handleBuy}>
          BUY
        </Button>
      </Grid>
    );
  };

  const fetchGlobal = async () => {
    try {
      const global = await publicApi.global();
      dispatch(appSlice.actions.setGlobal(global));
    } catch (e) {
      console.log(e);
    }
  };

  const fetchActivePet = async () => {
    if (activePet) {
      // Get pet active
      const pet: PetWithState = await nftPetApi.getMyPetFeed(
        activePet.pet?.nftId
      );
      dispatch(petSlice.actions.activePet({ pet }));
    }
  };

  const fetchPets = async () => {
    try {
      // Get list my pet
      const pets: Pet[] = await nftPetApi.getMyPets();
      if (pets.length > 0) {
        dispatch(petSlice.actions.setPets({ pets }));

        // Get pet active
        const pet: PetWithState = await nftPetApi.getMyPetFeed(
          activePet ? activePet.pet?.nftId : pets[0].nftId
        );
        dispatch(petSlice.actions.activePet({ pet }));
      }
    } catch (e: any) {
      console.log("Not found NFTs.");
    }
  };

  useEffect(() => {
    gaEventTracker("shop_viewed", "shop_viewed");
    amplitude.track("shop_viewed");
    if (!activePet) {
      fetchPets();
    }
  }, []);

  useEffect(() => {
    const loopId = setInterval(function () {
      fetchGlobal();
      fetchActivePet();
    }, 5000);

    return () => {
      if (loopId) {
        clearInterval(loopId);
      }
    };
  }, []);

  useEffect(() => {
    if (shopItem) {
      const find = shopItems?.find((i) => i.itemId === shopItem.itemId);
      if (find) {
        setShopItem(find);
      }
    }
  }, [shopItem, shopItems]);

  const youOwn =
    activePet?.petItems.find((i) => i.itemId === shopItem?.itemId)?.balance ||
    0;

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
          Shop
          <FlexGrow />
          <HeaderWallet />
        </Toolbar>
      </AppBar>
      {shopItem && activePet && (
        <ContentBorderWrapper>
          <Character>
            <CharacterName>{shopItem.itemName}</CharacterName>

            <Grid container columns={20}>
              {shopItem && (
                <Grid item xs={10}>
                  <ItemInfo>
                    <CharacterAttribute>
                      <CharacterAttributeLabel>Delta:</CharacterAttributeLabel>
                      <CharacterAttributeValue>
                        +{shopItem.itemDelta / 10 ** 9}
                      </CharacterAttributeValue>
                    </CharacterAttribute>
                    <CharacterAttribute>
                      <CharacterAttributeLabel>
                        You own:
                      </CharacterAttributeLabel>
                      <CharacterAttributeValue>
                        {youOwn}
                      </CharacterAttributeValue>
                    </CharacterAttribute>
                    <CharacterAttribute>
                      <CharacterAttributeLabel>Supply</CharacterAttributeLabel>
                      <CharacterAttributeValue>
                        {shopItem.itemSupplyLeft}/{shopItem.itemSupply}
                      </CharacterAttributeValue>
                    </CharacterAttribute>
                    <CharacterAttribute>
                      <CharacterAttributeLabel>Equip</CharacterAttributeLabel>
                      <CharacterAttributeValue>
                        <IOSSwitch
                          disabled={youOwn === 0}
                          checked={shopItemAsMain}
                          onChange={handleSetAsMain}
                        />
                      </CharacterAttributeValue>
                    </CharacterAttribute>
                    <CharacterAttribute>
                      <CharacterAttributeLabel>
                        <b>Price:</b>
                      </CharacterAttributeLabel>
                      <CharacterAttributeValue>
                        <b>MGEM {shopItem.itemPrice / 10 ** 9}</b>
                      </CharacterAttributeValue>
                    </CharacterAttribute>
                  </ItemInfo>
                </Grid>
              )}
              <Grid item xs={10} sx={{ position: "relative" }}>
                <AnimatedMainPet
                  equip={shopItem.itemId}
                  equipImage={shopItem.itemAnimationAction}
                />
                {shopItem.itemId === 2001 && <PetShield />}
              </Grid>
            </Grid>
          </Character>
          <Mention
            title={shopItem.itemTitleHint}
            subTitle={shopItem.itemDescription}
          />
          <ItemsBox sx={{ maxHeight: `${windowDimensions.height - 492}px` }}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {shopItems &&
                shopItems.map((item, idx) => (
                  <Grid item xs={4} key={`item-${idx}`}>
                    <SquareBox>
                      <ShopItem
                        selected={shopItem?.itemId === item.itemId}
                        onClick={handleClickShopItem(item)}
                      >
                        <img
                          // src={`assets/images2/shop-${item.itemId}.png`}
                          src={item.itemImage}
                          alt={item.itemName}
                        />
                      </ShopItem>
                    </SquareBox>
                  </Grid>
                ))}
            </Grid>
          </ItemsBox>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {renderShopButton()}
          </Grid>
        </ContentBorderWrapper>
      )}
    </MainContent>
  );
};

export default Page;

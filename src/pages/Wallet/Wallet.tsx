import * as authApi from "@/apis/auth";
import * as nftPetApi from "@/apis/nft-pet";
import * as publicApi from "@/apis/public";
import * as referApi from "@/apis/refer";
import { ReactComponent as SendIcon } from "@/assets/svg/account-send.svg";
import { ReactComponent as SpendingIcon } from "@/assets/svg/account-spending.svg";
import { ReactComponent as SwapIcon } from "@/assets/svg/account-swap.svg";
import { ReactComponent as CopyIcon } from "@/assets/svg/copy.svg";
import { ReactComponent as DiscordIcon } from "@/assets/svg/discord.svg";
import { ReactComponent as ManaIcon } from "@/assets/svg/mana.svg";
import { ENVS } from "@/configs/Configs.env";
import { useSelector } from "@/hooks/redux";
import { AuthContext } from "@/providers/AuthProvider";
import { appSelectors } from "@/redux/features/app/selectors";
import authSlice from "@/redux/features/auth/slice";
import { petSelectors } from "@/redux/features/pet/selectors";
import { getErrorMessage } from "@/types/error";
import { NUMBER_REGEX } from "@/utils/regex";
import useAnalyticsEventTracker from "@/utils/useAnalyticsEventTracker";
import * as amplitude from "@amplitude/analytics-browser";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  InputBase,
  styled,
  SvgIcon,
  Toolbar,
} from "@mui/material";
import Modal from "@mui/material/Modal";
import { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { ReactComponent as ReadDocsIcon } from "@/assets/svg/read-docs.svg";
import { ReactComponent as SolanaIcon } from "@/assets/svg/solana.svg";
import { MainContent } from "@/components/presentation/MainContent";
import useAccounts from "@/hooks/useAccounts";
import useReloadAccountBalance from "@/hooks/useReloadAccountBalance";
import useReloadBalance from "@/hooks/useReloadBalance";
import useTokens from "@/hooks/useTokens";
import appSlice from "@/redux/features/app/slice";
import { authSelector } from "@/redux/features/auth/selectors";
import petSlice from "@/redux/features/pet/slice";
import { Pet, PetWithState } from "@/types/pet";
import addressShorten from "@/utils/addressShorten";
import {
  balanceDisplayer,
  convertLamportsToSol,
  convertTokenDecimals,
} from "@/utils/convert";
import RPC from "../../components/WalletModal/solonaRPC";
import ScanWallet from "./components/ScanWallet";
import SpendingAccount from "./components/SpendingAccount";
import {
  AccountWallet,
  AccountWalletAmount,
  AccountWalletWrapper,
  ActionWalletButton,
  BoxSummaryBalance,
  CircleButton,
  SquareButton,
} from "./Wallet.styled";

const TabsButton = styled(Grid)(() => ({
  borderRadius: 50,
  position: "relative",
  overflow: "hidden",
  border: "1px solid #0D1615",
  boxShadow: "1px 1px 0px 0px #0D1615",
}));

const TabButton = styled(Button)`
  padding-left: 0;
  padding-right: 0;
  font-size: 12px !important;
  border-radius: 0;
  border: none;
  text-transform: unset;
`;
const DividerWrap = styled(Box)`
  height: 100%;
  width: 2px;
  background: black;
`;
export const CoinButton = styled(IconButton)(() => ({
  // backgroundColor: "#FEFAD3",
  borderRadius: "10px",
  boxShadow: "none",
}));

export const SwapInputBox = styled(Box)(() => ({
  display: "flex",
  background: "#fff",
  boxShadow: " 1px 1px 0px 0px #0D1615",
  borderRadius: "10px",
  border: "1px solid #0D1615",
  padding: "10px",
  flexDirection: "column",
  width: "100%",
}));

const AccountWalletAmountLabel = styled(Box)(() => ({
  fontSize: "12px",
  fontWeight: 300,
  lineHeight: "15px",
  letterSpacing: "0.07px",
  color: "#ABABAB",
  marginBottom: "4px",
}));

export const SwapInputBoxInput = styled(Box)(() => ({
  fontSize: "14px",
  fontWeight: 500,
  lineHeight: "17.5px",
  letterSpacing: "0.07px",
  width: "100%",

  "& input": {
    padding: 0,
    fontSize: "14px",
    fontWeight: 500,
    lineHeight: "17.5px",
    letterSpacing: "0.07px",
    width: "100%",
  },
}));
export const SwapInputBoxUnit = styled(Box)(() => ({
  display: "flex",
  // width: "60px",
  fontSize: "14px",
  fontWeight: 500,
  lineHeight: "15px",
  letterSpacing: "0.07px",
  alignItems: "left",
  justifyContent: "left",

  "& svg": {
    marginRight: "6px",
  },
}));

const AccountWalletCode = styled(Box)(() => ({
  background: "#fff",
  boxShadow: " 1px 1px 0px 0px #0D1615 !important",
  color: "#0D1615",
  borderRadius: "10px",
  border: "1px solid #0D1615",
  padding: "15px",
  marginBottom: "16px",
  display: "flex",
  alignItems: "center",
}));

const AccountWalletCodeLabel = styled(Box)(() => ({
  fontSize: "12px",
  fontWeight: "300",
  lineHeight: "15px",
  letterSpacing: "0.07px",
  color: "#ABABAB",
  flexGrow: 1,
}));

export const SwapInputBoxContent = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  marginBottom: "4px",

  "&:last-child": {
    marginBottom: 0,
  },
}));

export const SwapInputBoxLabel = styled(Box)(() => ({
  fontSize: "12px",
  fontWeight: 300,
  lineHeight: "15px",
  letterSpacing: "0.07px",
  color: "#ABABAB",
}));

const AccountWalletCodeValue = styled(Box)(() => ({
  fontSize: "14px",
  fontWeight: 500,
  lineHeight: "18px",
  letterSpacing: "0.07px",
  marginLeft: "10px",
  marginRight: "10px",
}));

const AccountWalletCodeIcon = styled(Box)(() => ({}));

const AccountActions = styled(Box)(() => ({
  marginBottom: "16px",
}));

const AccountSocial = styled(Box)(() => ({
  background: "#F7E8F6",
  boxShadow: "1px 1px 0px 0px #0D1615",
  color: "#0D1615",
  borderRadius: "10px",
  border: "1px solid #0D1615",
  padding: "15px 40px",
  marginBottom: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  fontSize: "12px",
  fontWeight: 500,
  letterSpacing: "0.07px",

  "& a": {
    color: "#0D1615",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",

    "& svg": {
      marginRight: "10px",
    },
  },
}));

const Rewards = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "16px",
}));

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

const RewardsCoinGroup = styled(Box)(() => ({
  background: "#FFF",
  boxShadow: "1px 1px 0px 0px #0D1615",
  color: "#0D1615",
  borderRadius: "10px",
  border: "1px solid #0D1615",
  padding: "12px 15px",
  display: "flex",
  width: "40%",
  flexDirection: "column",
}));

const RewardsCoinGroupLabel = styled(Box)(() => ({
  fontSize: "12px",
  fontWeight: "300",
  lineHeight: "15px",
  letterSpacing: "0.07px",
  color: "#ABABAB",
  marginBottom: "4px",
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

const RewardsClaim = styled(Box)(() => ({
  marginBottom: "16px",
}));

const Page: React.FC = () => {
  const [tab, setTab] = useState<number>(0);
  const { provider, isSocialLogin, logout } = useContext(AuthContext);
  const authState: any = useSelector(authSelector.selectorDomain);
  const navigate = useNavigate();
  useReloadBalance(5000);
  useReloadAccountBalance(8000);
  // const [provider, setProvider] = useState<IProvider | null>(null);
  const dispatch = useDispatch();
  const { amount, address } = useAccounts();
  const { gemToken, mpToken } = useTokens();

  const activePet = useSelector(petSelectors.selectActivePet);
  const global = useSelector(appSelectors.selectGlobal);

  const gaEventTracker = useAnalyticsEventTracker("Wallet");

  const [pointValue, setPointValue] = useState<any>(null);
  const [receive, setReceive] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGlobal = async () => {
      const global = await publicApi.global();
      dispatch(appSlice.actions.setGlobal(global));
    };

    if (tab === 2) {
      fetchGlobal();
    }
  }, [tab]);

  const onClaimReWard = async () => {
    try {
      setLoading(true);
      if (pointValue > 0) {
        const result: any = await nftPetApi.claimReward(
          activePet?.pet?.nftId,
          Number.parseFloat(pointValue.toString())
        );
        toast.success(result?.order?.message);
        setLoading(false);
        if (activePet) {
          console.log(
            "🚀 ~ onClaimReWard ~ activePet:",
            activePet?.pet,
            activePet?.pet?.petScore - +pointValue
          );
          dispatch(
            petSlice.actions.activePet({
              pet: {
                ...activePet,
                pet: {
                  ...activePet.pet,
                  petScore: activePet.pet.petScore - +pointValue,
                },
              },
            })
          );
        }

        setPointValue("");
      }
    } catch (e: any) {
      const message = getErrorMessage(e);
      toast(message || "Claim failed");
      setLoading(false);
    }
  };

  // const activePet = useSelector(petSelectors.selectActivePet);

  const [showModal, setShowModal] = useState(false);
  const [showModalScan, setShowModalScan] = useState(false);
  const handleOpen = () => {
    if (isSocialLogin) {
      setShowModal(true);
    } else {
      toast.info("Just socials login");
    }
  };
  const handleOpenScan = () => {
    setShowModalScan(true);
  };
  const handleClose = () => {
    setShowModal(false);
  };
  const handleCloseScan = () => {
    setShowModalScan(false);
  };
  const handleCopyKey = async () => {
    if (!provider) return;
    // const web3authProvider: any = await web3AuthGlobal.connect();
    const rpc = new RPC(provider);
    const privateKey = await rpc.getPrivateKey();
    await navigator.clipboard.writeText(privateKey);
    toast.success("Copied to clipboard");
  };

  const handleCopyReferralCode = async () => {
    const referralCode = authState?.user?.referralCode;
    const linkReferral = `${ENVS.REACT_APP_WEB_ENDPOINT}/referral/${referralCode}`;
    await navigator.clipboard.writeText(linkReferral);
    toast.success("Copied to clipboard");
  };

  const renderWallet = () => {
    gaEventTracker("view_account", "view_account");
    amplitude.track("view_account");
    return (
      <>
        <Modal
          sx={{ position: "absolute" }}
          container={() => document.getElementById("main-app")}
          open={showModalScan}
          onClose={handleCloseScan}
          aria-labelledby="child-modal-title"
          aria-describedby="child-modal-description"
        >
          <Box sx={{ ...style, width: 400 }}>
            <h2 id="child-modal-title">Scan Wallet</h2>
            <ScanWallet address={address || ""} />
          </Box>
        </Modal>
        <Modal
          sx={{ position: "absolute" }}
          container={() => document.getElementById("main-app")}
          open={showModal}
          onClose={handleClose}
          aria-labelledby="child-modal-title"
          aria-describedby="child-modal-description"
        >
          <Box sx={{ ...style, width: 400 }}>
            <h2 id="child-modal-title">Export Wallet</h2>
            <p id="child-modal-description" className="warning-modal">
              Warning:
              <span className="content-warning">
                Never share you private key with anyone! It controls your
                account.
              </span>
            </p>
            <Button style={{ width: "100%" }} onClick={handleCopyKey}>
              Copy Key
            </Button>
          </Box>
        </Modal>
        <BoxSummaryBalance>
          <span className="text-total">TOTAL BALANCE</span>
          <span className="text-balance">
            {balanceDisplayer(convertLamportsToSol(amount))} SOL
          </span>
          <CircleButton
            onClick={() => {
              navigator.clipboard.writeText(address || "");
              handleOpenScan();
              toast.success("Copied to clipboard");
            }}
            sx={{
              width: "fit-content",
              mx: "auto",
              bgcolor: "#fff ",
            }}
          >
            {addressShorten(address, 5, 5)}
          </CircleButton>

          <Grid
            sx={{
              width: "80%",
              display: "flex",
              justifyContent: "space-between",
              mx: "auto",
              mt: 3,
            }}
          >
            <ActionWalletButton item>
              <SquareButton
                onClick={() => {
                  navigate("/wallet/withdraw");
                }}
              >
                <SendIcon />
              </SquareButton>
              Send
            </ActionWalletButton>
            <ActionWalletButton item>
              <SquareButton onClick={() => navigate("/wallet/deposit")}>
                <SpendingIcon />
              </SquareButton>
              To Spending
            </ActionWalletButton>
            <ActionWalletButton item>
              <SquareButton onClick={() => navigate("/wallet/swap")}>
                <SwapIcon />
              </SquareButton>
              Swap
            </ActionWalletButton>
          </Grid>
        </BoxSummaryBalance>
        <Divider
          sx={{ my: "24px", background: "#E9D4E8", borderColor: "#E9D4E8" }}
        />
        <Box sx={{ mb: 1 }}>Wallet account</Box>
        <AccountWalletWrapper>
          <AccountWallet>
            <CoinButton>
              <img
                style={{ width: 16 }}
                src="/assets/images/gem-token.gif"
                alt="loading..."
              />
            </CoinButton>
            <AccountWalletAmount>
              {balanceDisplayer(
                +convertTokenDecimals(gemToken.balance, gemToken.decimals)
              )}{" "}
              {gemToken.symbol}
            </AccountWalletAmount>
          </AccountWallet>
          <AccountWallet>
            <CoinButton>
              <SolanaIcon />
            </CoinButton>
            <AccountWalletAmount>
              {balanceDisplayer(convertLamportsToSol(amount))} SOL
            </AccountWalletAmount>
          </AccountWallet>
          <AccountWallet>
            <CoinButton>
              <img
                width={16}
                height={16}
                src="https://cdn.manekopet.xyz/token/mp/logo.png"
              />
            </CoinButton>
            <AccountWalletAmount>
              {balanceDisplayer(+mpToken.balance / 10 ** mpToken.decimals, 3)}{" "}
              MP
            </AccountWalletAmount>
          </AccountWallet>
        </AccountWalletWrapper>
        <AccountActions>
          <Box sx={{ mb: 1 }}>Settings</Box>
          <Grid container spacing={2}>
            <Grid item xs>
              <Button
                fullWidth
                size="large"
                style={{ fontSize: 12 }}
                onClick={handleOpen}
                color="warning"
              >
                EXPORT WALLET
              </Button>
            </Grid>
            <Grid item xs>
              <Button
                onClick={logout}
                style={{ fontSize: 12 }}
                fullWidth
                size="large"
                color="warning"
              >
                LOG OUT
              </Button>
            </Grid>
          </Grid>
        </AccountActions>
        <AccountSocial>
          <Link to="https://discord.gg/58cNaFBWaN">
            <DiscordIcon />
            JOIN DISCORD
          </Link>
          <Box>|</Box>
          <Link to="https://docs.manekopet.xyz">
            <ReadDocsIcon />
            READ DOCS
          </Link>
        </AccountSocial>
      </>
    );
  };

  const parseValueNumber = (value: string) => {
    return (value || "").replace(NUMBER_REGEX, "");
  };

  const handleRewardsClaim = async () => {
    try {
      await referApi.rewardsEarnClaim();
      const profile: any = await authApi.getProfile();
      dispatch(
        authSlice.actions.loginSuccess({
          accessToken: window.token,
          user: profile?.user,
          balance: profile?.balance,
          socialData: profile?.socialdata,
        })
      );
      toast.success("Claim reward successfully");
    } catch (e: any) {
      console.log("rewards earn claim err", e);
      toast.error(e.message);
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

  const handleClaimRewardBalance = async (nftId: string, point: number) => {
    try {
      const result: any = await nftPetApi.claimRewardBalance(nftId, point);
      console.log("result", result);
      toast.success(result?.order?.message || "Claim reward successfully");
      await fetchPets();
    } catch (e: any) {
      console.log("rewards earn claim err", e.message);
      toast.error(e.message);
    }
  };

  const renderRewards = () => {
    gaEventTracker("view_rewards", "view_rewards");
    amplitude.track("view_rewards");
    return (
      <>
        <AccountWalletWrapper>
          <AccountWallet>
            <CoinButton>
              {/* <img
                style={{ width: 16 }}
                src="/assets/images/gem-token.gif"
                alt="loading..."
              /> */}
              <ManaIcon />
            </CoinButton>
            <AccountWalletAmount>
              <Box>
                <AccountWalletAmountLabel>Balance</AccountWalletAmountLabel>
                <Box>
                  {activePet?.pet?.petScore
                    ? balanceDisplayer(String(activePet?.pet?.petScore), 2)
                    : 0}{" "}
                  PTS
                </Box>
              </Box>
            </AccountWalletAmount>
          </AccountWallet>
        </AccountWalletWrapper>
        <AccountWalletWrapper>
          <AccountWallet>
            <CoinButton>
              <img
                style={{ width: 16 }}
                src="/assets/images/gem-token.gif"
                alt="loading..."
              />
            </CoinButton>
            <AccountWalletAmount>
              <Box>
                <AccountWalletAmountLabel>
                  Reward balance
                </AccountWalletAmountLabel>
                <Box>
                  {balanceDisplayer((activePet?.petReward || 0) / 1e9, 3)} MGEM
                  {/* {authState?.balance?.symbol} */}
                </Box>
              </Box>
            </AccountWalletAmount>
            <CircleButton
              color="secondary"
              disabled={(activePet?.petReward || 0) <= 0}
              onClick={() => {
                handleClaimRewardBalance(
                  activePet?.pet?.nftId || "",
                  activePet?.pet?.petRewardsBalance || 0
                );
              }}
            >
              Claim
            </CircleButton>
          </AccountWallet>
        </AccountWalletWrapper>
        <Divider sx={{ borderStyle: "dotted", mb: "24px" }} />
        <Rewards>
          <RewardsCoinGroup style={{ paddingBottom: 6, paddingTop: 8 }}>
            <RewardsCoinGroupLabel>Burn pet score</RewardsCoinGroupLabel>
            <RewardsCoinGroupAmount style={{ alignItems: "center" }}>
              <ManaIcon style={{ width: 28 }} />
              {/* <img
                style={{ width: 16 }}
                src="/assets/images/gem-token.gif"
                alt="loading..."
              /> */}
              <InputBase
                style={{ fontSize: 14 }}
                sx={{ width: "100%" }}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const val: any = e.target.value;
                  const score: any = activePet?.pet?.petScore;
                  if (score === 0 || score === undefined) {
                    toast.error("Your balance is insufficient.");
                    return;
                  }
                  e.target.value = parseValueNumber(val);
                  setPointValue(parseValueNumber(val));
                  if (val > score) {
                    toast.error("Your balance is insufficient.");
                    return false;
                  }
                  const receiveValue: any = val * (global?.point_price || 0);
                  if (val !== "") {
                    setReceive(receiveValue);
                  } else {
                    setReceive(0);
                  }
                }}
                value={pointValue}
                placeholder="Score"
                onKeyDown={(e) => {
                  if (e.key === "e" || e.key === "-") {
                    e.preventDefault();
                  }
                }}
              />
              PTS
            </RewardsCoinGroupAmount>
          </RewardsCoinGroup>
          <IconButton size="small" sx={{ backgroundColor: "#fff" }}>
            <ChevronRightIcon />
          </IconButton>
          <RewardsCoinGroup>
            <RewardsCoinGroupLabel>Receive</RewardsCoinGroupLabel>
            <RewardsCoinGroupAmount>
              {/* <SolanaIcon /> */}
              <img
                style={{ width: 16, height: 16, marginRight: "3px" }}
                src="/assets/images/gem-token.gif"
                alt="loading..."
              />
              {balanceDisplayer(receive / 1e9)} MGEM
            </RewardsCoinGroupAmount>
          </RewardsCoinGroup>
        </Rewards>
        <RewardsClaim>
          <Button
            onClick={() => onClaimReWard()}
            fullWidth
            disabled={
              loading ||
              !receive ||
              activePet?.pet?.petScore === 0 ||
              activePet?.pet?.petScore === undefined ||
              pointValue > activePet?.pet?.petScore
            }
            size="large"
          >
            {loading ? (
              <CircularProgress color="inherit" size={24} />
            ) : (
              "CLAIM REWARDS"
            )}
          </Button>
        </RewardsClaim>
        {/* <Mention
          title={"Your progress will be lost "}
          subTitle={"When pet score is burnt progress goes to zero ,"}
        ></Mention> */}
        <Divider sx={{ borderStyle: "dotted", mb: "24px" }} />
        <AccountWalletCode>
          <AccountWalletCodeLabel>
            Your code to invite friends and get 10% on their $MGEM spent:
          </AccountWalletCodeLabel>
          <AccountWalletCodeValue>
            {authState?.user?.referralCode}
          </AccountWalletCodeValue>
          <AccountWalletCodeIcon>
            <SvgIcon onClick={handleCopyReferralCode}>
              <CopyIcon />
            </SvgIcon>
          </AccountWalletCodeIcon>
        </AccountWalletCode>
        <AccountWalletWrapper>
          <AccountWallet>
            {/* <CoinButton>
              <img
                style={{ width: 16 }}
                src="/assets/images/gem-token.gif"
                alt="loading..."
              />
            </CoinButton> */}
            <CoinButton>
              <img
                style={{ width: 16 }}
                src="/assets/images/gem-token.gif"
                alt="loading..."
              />
            </CoinButton>
            <AccountWalletAmount>
              <Box>
                <AccountWalletAmountLabel>
                  Reward from referrals
                </AccountWalletAmountLabel>
                <Box>
                  {balanceDisplayer(authState?.user?.incomeEarned / 10 ** 9, 3)}{" "}
                  MGEM
                  {/* {authState?.balance?.symbol} */}
                </Box>
              </Box>
            </AccountWalletAmount>
            <CircleButton color="secondary" onClick={handleRewardsClaim}>
              Claim
            </CircleButton>
          </AccountWallet>
        </AccountWalletWrapper>
      </>
    );
  };

  const handleChangeTab = (tabNumber: number) => {
    return () => {
      setTab(tabNumber);
    };
  };

  const handleBack = () => {
    navigate("/my-pet");
  };

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
          Wallet
        </Toolbar>
      </AppBar>
      <TabsButton
        className="wallet-top-menu"
        container
        // spacing={1}
        sx={{ mb: "20px" }}
      >
        <Grid item xs>
          <TabButton
            fullWidth
            color={tab === 0 ? "secondary" : "info"}
            onClick={handleChangeTab(0)}
          >
            Wallet
          </TabButton>
        </Grid>
        <DividerWrap />
        <Grid item xs>
          <TabButton
            fullWidth
            color={tab === 1 ? "secondary" : "info"}
            onClick={handleChangeTab(1)}
          >
            Spending
          </TabButton>
        </Grid>
        <DividerWrap />
        <Grid item xs>
          <TabButton
            fullWidth
            color={tab === 2 ? "secondary" : "info"}
            onClick={handleChangeTab(2)}
          >
            Rewards
          </TabButton>
        </Grid>
      </TabsButton>
      <Box>
        {tab === 0 && renderWallet()}
        {tab === 1 && <SpendingAccount />}
        {/* {tab === 1 && renderSwap()} */}
        {tab === 2 && renderRewards()}
      </Box>
    </MainContent>
  );
};

export default Page;

import * as nftPetApi from "@/apis/nft-pet";
import { ReactComponent as CopyIcon } from "@/assets/svg/copy.svg";
import { ReactComponent as SolanaIcon } from "@/assets/svg/solana.svg";
import ContentBorderWrapper from "@/components/presentation/ContentBorderWrapper";
import FlexGrow from "@/components/presentation/FlexGrow";
import { MainContent } from "@/components/presentation/MainContent";
import useMintNft from "@/hooks/useMintNft";
import useReloadAccountBalance from "@/hooks/useReloadAccountBalance";
import petSlice from "@/redux/features/pet/slice";
import { Pet, PetWithState } from "@/types/pet";
import { convertLamportsToSol } from "@/utils/convert";
import * as amplitude from "@amplitude/analytics-browser";
import {
  CircularProgress,
  Grid,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  styled,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import RPC from "../../components/WalletModal/solonaRPC";
import { useDispatch } from "../../hooks/redux";
import useAccounts from "../../hooks/useAccounts";
import { AuthContext } from "../../providers/AuthProvider";
import authSlice from "../../redux/features/auth/slice";
import "./Onboarding.css"; // Import CSS file for custom styles
import {
  AccountActions,
  AnimatedMainPet,
  StepContainer,
  StepDescription,
  StepSubDescription,
  WalletAddressBox,
  WalletAddressBoxAddress,
  WalletAmount,
  WalletAmountBox,
} from "./Onboarding.styled";
import SwapForm from "./SwapForm";

const ContainerLoading = styled(Box)(() => ({
  width: "100%",
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "absolute",
  top: 0,
  left: 0,
  color: "#000",
  zIndex: 9999,
}));

const GuideModalBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  background: "#fff",
  padding: theme.spacing(3),
  textAlign: "center",
}));

const GuideModalTitle = styled(Box)(() => ({
  fontSize: "20px",
  fontWeight: "500",
  lineHeight: "20px",
  letterSpacing: "0.07px",
  textAlign: "center",
  marginBottom: "30px",
}));

const GuideModalContent = styled(Box)(() => ({
  fontSize: "14px",
  fontWeight: "400",
  lineHeight: "20px",
  letterSpacing: "0.07px",
  textAlign: "center",
  marginBottom: "30px",

  "& svg": {
    verticalAlign: "middle",
  },
}));

const MINIMUM_BALANCE = 0.5;

const StepButtons = styled(Box)(() => ({}));

const Onboarding = () => {
  useReloadAccountBalance(5000);
  const [currentStep, setCurrentStep] = useState(0);
  const {
    address,
    amount: balance,
    isFetching: balanceFetching,
  } = useAccounts();
  const { logout, provider, isSocialLogin } = useContext(AuthContext);
  const [firstLoading, setFirstLoading] = useState(true);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const disabledBalance = +balance / LAMPORTS_PER_SOL < MINIMUM_BALANCE;
  const { onMintNft, isMinting } = useMintNft();

  const fetchPets = async () => {
    try {
      // Get list my pet
      const pets: Pet[] = await nftPetApi.getMyPets();
      if (pets.length > 0) {
        dispatch(petSlice.actions.setPets({ pets }));

        // Get pet active
        const pet: PetWithState = await nftPetApi.getMyPetFeed(pets[0].nftId);
        dispatch(petSlice.actions.activePet({ pet }));
        dispatch(authSlice.actions.setFinishedOnboarding());
        navigate("/my-pet");
      }
      setFirstLoading(false);
    } catch (e: any) {
      setFirstLoading(false);
      console.log("Not found NFTs.");
    }
  };

  useEffect(() => {
    fetchPets();
  });

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

  const [showModal, setShowModal] = useState(false);
  const handleOpen = () => {
    if (isSocialLogin) {
      setShowModal(true);
    } else {
      toast.info("Just socials login");
    }
  };
  const handleClose = () => {
    setShowModal(false);
  };
  const handleCopyKey = async () => {
    if (!provider) return;
    // const web3authProvider: any = await web3AuthGlobal.connect();
    const rpc = new RPC(provider);
    const privateKey = await rpc.getPrivateKey();
    await navigator.clipboard.writeText(privateKey);
    toast.success("Copied to clipboard");
  };

  const handleCopyAddress = async () => {
    await navigator.clipboard.writeText(address || "");
    toast.success("Copied to clipboard");
  };

  const handleGoToNextStep = () => {
    if (currentStep < 2) {
      // if (disabledBalance) return;
      setCurrentStep(currentStep + 1);
    } else {
      handleFinish();
    }
  };

  const handleGoToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = useCallback(async () => {
    dispatch(authSlice.actions.setFinishedOnboarding());
  }, []);

  const handleMint = async () => {
    amplitude.track("step-3-petmint-started");
    const nftId = await onMintNft();
    if (nftId) {
      amplitude.track("step-3-petmint-success");
      dispatch(authSlice.actions.setFinishedOnboarding());
      navigate("/my-pet");
    }
  };

  const renderStep1 = () => {
    amplitude.track("new-user-signup");
    return (
      <StepContainer>
        <StepDescription sx={{ mb: "10px" }}>
          You'll need some SOL to started.
        </StepDescription>
        <StepSubDescription sx={{ mb: "20px" }}>
          below or click Deposit in the wallet send from mainnet "deposit SOL" ,
          a minimum of 0.1 SOL is required
        </StepSubDescription>

        <WalletAmountBox sx={{ mb: "16px" }}>
          <SolanaIcon />
          Solana
          <FlexGrow />
          <WalletAmount isFetching={balanceFetching}>
            {convertLamportsToSol(balance)} SOL
          </WalletAmount>
        </WalletAmountBox>
        <WalletAddressBox sx={{ mb: "20px" }}>
          <WalletAddressBoxAddress>{address}</WalletAddressBoxAddress>
          <CopyIcon
            style={{ width: 25, height: 16 }}
            onClick={handleCopyAddress}
          />
        </WalletAddressBox>
      </StepContainer>
    );
  };

  const renderStep2 = () => {
    amplitude.track("step-1-completed");
    return <SwapForm />;
  };

  const renderStep3 = () => {
    amplitude.track("step-2-completed");
    return (
      <StepContainer>
        <StepDescription sx={{ mb: "10px" }}>
          Mint your first ManekoPet!
        </StepDescription>
        <ContentBorderWrapper
          sx={{ mb: "20px", height: "150px", position: "relative" }}
        >
          <AnimatedMainPet />
        </ContentBorderWrapper>
        <Button
          size="large"
          fullWidth
          sx={{ mb: "30px" }}
          onClick={handleMint}
          disabled={isMinting}
        >
          {isMinting ? "MINTING ..." : "MINT NFT"}
        </Button>
      </StepContainer>
    );
  };

  const stepsData: { label: string; render: () => React.ReactElement }[] = [
    {
      label: "Fund your wallet",
      render: renderStep1,
    },
    {
      label: "Swap",
      render: renderStep2,
    },
    {
      label: "Mint",
      render: renderStep3,
    },
  ];

  const Loader = () => {
    return (
      <ContainerLoading>
        <CircularProgress color="inherit" />
      </ContainerLoading>
    );
  };

  if (firstLoading) {
    return Loader();
  }

  return (
    <MainContent>
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
              Never share you private key with anyone! It controls your account.
            </span>
          </p>
          <Button style={{ width: "100%" }} onClick={handleCopyKey}>
            Copy Key
          </Button>
        </Box>
      </Modal>
      <h1 className="title-page">Follow steps to join ManekoPet</h1>
      <AccountActions>
        <Grid container spacing={2}>
          <Grid item xs>
            <Button
              fullWidth
              className="export-wallet"
              size="large"
              onClick={handleOpen}
              color="warning"
            >
              EXPORT WALLET
            </Button>
          </Grid>
          <Grid item xs>
            <Button
              className="export-wallet"
              onClick={() => logout()}
              fullWidth
              size="large"
              color="warning"
            >
              LOG OUT
            </Button>
          </Grid>
        </Grid>
      </AccountActions>
      <ContentBorderWrapper>
        <Stepper
          sx={{ width: "100%" }}
          activeStep={currentStep}
          orientation="vertical"
        >
          {stepsData.map((stepItem, index) => (
            <Step key={`step-${index}`}>
              <StepLabel onClick={() => setCurrentStep(index)}>
                {stepItem.label}
              </StepLabel>
              <StepContent>
                {stepItem.render()}
                <StepButtons>
                  <Button
                    color="secondary"
                    onClick={handleGoToNextStep}
                    sx={{ mr: "10px", width: "104px" }}
                  >
                    {currentStep === 2 ? "FINISH" : "CONTINUE"}
                  </Button>
                  <Button color="info" onClick={handleGoToPreviousStep}>
                    Back
                  </Button>
                </StepButtons>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </ContentBorderWrapper>
    </MainContent>
  );
};

export default Onboarding;

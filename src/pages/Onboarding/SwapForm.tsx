import { ReactComponent as SolanaIcon } from "@/assets/svg/solana.svg";

import FlexGrow from "@/components/presentation/FlexGrow";
import useTokens from "@/hooks/useTokens";
import { yupResolver } from "@hookform/resolvers/yup";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Button, IconButton } from "@mui/material";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import * as Yup from "yup";

import InputForm from "@/components/Form/InputForm";
import useAccounts from "@/hooks/useAccounts";
import useDebounce from "@/hooks/useDebounce";
import useSwap from "@/hooks/useSwap";
import { useThrottle } from "@/hooks/useThrottle";
import { appSelectors } from "@/redux/features/app/selectors";
import {
  balanceDisplayer,
  convertLamportsToSol,
  convertTokenDecimals,
} from "@/utils/convert";
import { useState } from "react";
import { useSelector } from "react-redux";
import {
  StepContainer,
  SwapInputBox,
  SwapInputBoxBalance,
  SwapInputBoxContent,
  SwapInputBoxInput,
  SwapInputBoxLabel,
  SwapInputBoxUnit,
  SwapInputBoxWrapper,
} from "./Onboarding.styled";

enum INPUT_FORM {
  TOKEN = "token",
}

export default function SwapForm() {
  const {
    amount: balance,
    decimals,
    isFetching: balanceFetching,
  } = useAccounts();
  const { mintPrice = 10 }: any = useSelector(appSelectors.selectGlobal);

  const { gemToken } = useTokens();
  const [estAmount, setEstAmount] = useState(0);
  const [isDirection, setIsDirection] = useState(false);
  const [estMsg, setEstMsg] = useState("");
  const schema = Yup.object({
    [INPUT_FORM.TOKEN]: Yup.number()
      .transform((value) =>
        isNaN(value) || value === null || value === undefined ? 0 : value
      )
      .min(0.0001, "Mint token is 0.0001")
      // .max(200, "Max token to swap is 200")
      .required("Required field"),
  });
  const methods = useForm({
    mode: "all",
    resolver: yupResolver(schema),
    // defaultValues: {
    //   [INPUT_FORM.TOKEN]: 0,
    // },
  });
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = methods;

  const { estTokenAmountOut, handleSwap, isSwapping } = useSwap();

  const tokenValue = useWatch({
    control,
    name: INPUT_FORM.TOKEN,
  });

  const errorsTokens = errors[INPUT_FORM.TOKEN];
  useDebounce(
    async () => {
      if (errorsTokens) return;
      if (tokenValue > 0) {
        if (isDirection) {
          if (
            tokenValue >
            +gemToken.balance / Math.pow(10, gemToken.decimals)
          ) {
            setError(INPUT_FORM.TOKEN, {
              message: `Your balance is insufficient. Deposit now.`,
            });
          }
        } else {
          if (tokenValue > +balance / Math.pow(10, decimals)) {
            setError(INPUT_FORM.TOKEN, {
              message: `Your balance is insufficient. Deposit now.`,
            });
          }
        }

        try {
          const { amount } = await estTokenAmountOut({
            inputNumber: tokenValue,
            isDirection,
          });
          // if (amount > 200) {
          //   // setError(INPUT_FORM.TOKEN, {
          //   //   message: "Max token to swap is 200",
          //   // });
          //   setEstMsg("Max token to swap is 200");
          // } else {
          //   setEstMsg("");
          // }
          setEstAmount(amount);
        } catch (error) {
          setEstAmount(0);
        }
      }
    },
    [tokenValue, errorsTokens, isDirection],
    1000
  );

  const validateInputAmount = () => {
    if (tokenValue > 0) {
      if (isDirection) {
        if (tokenValue > +gemToken.balance / Math.pow(10, gemToken.decimals)) {
          setError(INPUT_FORM.TOKEN, {
            message: `Your balance is insufficient. Deposit now.`,
          });
        }
      } else {
        if (tokenValue > +balance / Math.pow(10, decimals)) {
          setError(INPUT_FORM.TOKEN, {
            message: `Your balance is insufficient. Deposit now.`,
          });
        }
      }
    }
  };
  const onSubmit = useThrottle(async (values: { token: number }) => {
    console.log("🚀 ~ onSubmit ~ values:", values);
    await handleSwap({
      inputNumber: values.token,
      isDirection,
    });
  }, 2000);

  const handleDirection = () => {
    setIsDirection((pre) => !pre);
  };
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <StepContainer>
          {/* <StepDescription sx={{ mb: "10px" }}>
            You'll need {mintPrice} $MGEM to mint a pet.
          </StepDescription>
          <StepSubDescription sx={{ mb: "20px" }}>
            Swap some SOL for Maneko tokens (MP) Skip this step if you have $MP
            tokens.
          </StepSubDescription> */}
          <SwapInputBoxWrapper sx={{ mb: "20px" }}>
            <SwapInputBox sx={{ mb: "10px" }}>
              <SwapInputBoxContent>
                <SwapInputBoxLabel>You pay:</SwapInputBoxLabel>
                <FlexGrow />
                <SwapInputBoxBalance isFetching={balanceFetching}>
                  Balance:{" "}
                  {isDirection
                    ? balanceDisplayer(
                        convertTokenDecimals(
                          gemToken.balance,
                          gemToken.decimals
                        )
                      )
                    : convertLamportsToSol(balance)}
                </SwapInputBoxBalance>
              </SwapInputBoxContent>
              <SwapInputBoxContent>
                <SwapInputBoxInput>
                  <InputForm
                    name={INPUT_FORM.TOKEN}
                    control={control}
                    errors={errors}
                    onlyNumber
                    placeholder="Enter amount"
                    onChangeInput={() => validateInputAmount()}
                  />
                </SwapInputBoxInput>
                <FlexGrow />
                <SwapInputBoxUnit>
                  {isDirection ? (
                    <>
                      <img
                        style={{ width: 16, marginRight: 5 }}
                        src="/assets/images/gem-token.gif"
                        alt="loading..."
                      />{" "}
                      MGEM
                    </>
                  ) : (
                    <>
                      <SolanaIcon /> SOL
                    </>
                  )}
                </SwapInputBoxUnit>
              </SwapInputBoxContent>
            </SwapInputBox>
            <IconButton
              size="small"
              sx={{ backgroundColor: "#fff", mb: "10px" }}
              onClick={handleDirection}
            >
              <ExpandMoreIcon />
            </IconButton>
            <SwapInputBox>
              <SwapInputBoxContent>
                <SwapInputBoxLabel>You receive:</SwapInputBoxLabel>
                <FlexGrow />
                <SwapInputBoxBalance isFetching={balanceFetching}>
                  Balance:{" "}
                  {!isDirection
                    ? balanceDisplayer(
                        convertTokenDecimals(
                          gemToken.balance,
                          gemToken.decimals
                        )
                      )
                    : convertLamportsToSol(balance)}
                </SwapInputBoxBalance>
              </SwapInputBoxContent>
              <SwapInputBoxContent>
                <SwapInputBoxInput>
                  {balanceDisplayer(estAmount)}
                </SwapInputBoxInput>
                <FlexGrow />
                <SwapInputBoxUnit>
                  {!isDirection ? (
                    <>
                      <img
                        style={{ width: 16, marginRight: 5 }}
                        src="/assets/images/gem-token.gif"
                        alt="loading..."
                      />{" "}
                      MGEM
                    </>
                  ) : (
                    <>
                      <SolanaIcon /> SOL
                    </>
                  )}
                </SwapInputBoxUnit>
              </SwapInputBoxContent>
              {estMsg && (
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 300,
                    color: "#fb2929",
                  }}
                >
                  {estMsg}
                </span>
              )}
            </SwapInputBox>
          </SwapInputBoxWrapper>
          <Button
            disabled={isSwapping}
            type="submit"
            size="large"
            fullWidth
            sx={{ mb: "30px" }}
          >
            {isSwapping ? "SWAPPING ..." : "SWAP"}
          </Button>
        </StepContainer>
      </form>
    </FormProvider>
  );
}

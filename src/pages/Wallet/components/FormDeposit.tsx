import { ReactComponent as SpendingIcon } from "@/assets/svg/account-spending2.svg";
import { ReactComponent as WalletIcon } from "@/assets/svg/account-wallet.svg";
import { ReactComponent as SwitchIcon } from "@/assets/svg/transfer-switch.svg";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";

import InputForm from "@/components/Form/InputForm";
import { useSelector } from "@/hooks/redux";
import useReloadAccountBalance from "@/hooks/useReloadAccountBalance";
import useReloadBalance from "@/hooks/useReloadBalance";
import useSpending from "@/hooks/useSpending";
import useTokens from "@/hooks/useTokens";
import { authSelector } from "@/redux/features/auth/selectors";
import { ISymbol } from "@/types/auth";
import { balanceDisplayer } from "@/utils/convert";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SwitchTransfer, Wrapper } from "./styled";

enum INPUT_FORM {
  AMOUNT = "amount",
}

export default function FormDeposit() {
  useReloadAccountBalance(5000);
  useReloadBalance(5000);
  const { gemToken, mpToken } = useTokens();
  const { loading, depositToken, depositTokenWithoutFee, withDrawalToken } =
    useSpending();
  const [isSpending, setIsSpending] = useState(false);
  const navigate = useNavigate();
  const [selectToken, setSelectToken] = useState<ISymbol>(ISymbol.MGEM);
  const balance = useSelector(authSelector.selectBalance);

  const balanceToken = useMemo(() => {
    if (isSpending) {
      console.log("nce[selectToken].balance: ", balance[selectToken].balance);
      return balance[selectToken].balance;
    }
    if (selectToken === ISymbol.MGEM) {
      return gemToken.balance;
    }
    return mpToken.balance;
  }, [selectToken, isSpending, balance, gemToken.balance, mpToken.balance]);

  const decimalsToken = useMemo(() => {
    if (isSpending) return 9;
    switch (selectToken) {
      case "MGEM":
        return gemToken.decimals;
      case "MP":
        return mpToken.decimals;
      default:
        return 0;
    }
  }, [gemToken.decimals, isSpending, mpToken.decimals, selectToken]);

  const schema = Yup.object({
    [INPUT_FORM.AMOUNT]: Yup.number()
      .transform((value) =>
        isNaN(value) || value === null || value === undefined ? 0 : value
      )
      .min(1, "Mint balance is 1")
      .max(
        +balanceToken / Math.pow(10, decimalsToken),
        "Amount must less than your balance"
      )
      .required("Required Amount"),
  });
  const methods = useForm({
    mode: "all",
    resolver: yupResolver(schema),
  });
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = methods;

  const onSubmit = async (values: { amount: number }) => {
    if (isSpending) {
      withDrawalToken({
        itemId: balance[selectToken as ISymbol].itemId,
        amount: +values.amount,
      });
    } else {
      if (selectToken === ISymbol.MGEM) {
        await depositToken(values.amount);
        return;
      }
      await depositTokenWithoutFee(values.amount);
    }
  };

  const handleSwitch = () => {
    setIsSpending((pre) => !pre);
    setValue(INPUT_FORM.AMOUNT, 0);
  };
  const handleChange = (event: SelectChangeEvent) => {
    setSelectToken(event.target.value as ISymbol);
    setValue(INPUT_FORM.AMOUNT, 0);
  };
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Wrapper>
          <div>
            <SwitchTransfer>
              <div className="form-swap">
                <div className="form-from">
                  {isSpending ? <SpendingIcon /> : <WalletIcon />}
                  {/* <InputForm
                  name={INPUT_FORM.FORM}
                  control={control}
                  errors={errors}
                  onlyNumber
                  className="input-form"
                  placeholder="From"
                /> */}
                  <div className="text-label">From</div>
                  <div className="text">
                    {isSpending ? "Spending" : "Wallet"}
                  </div>
                </div>
                <div className="divider"></div>
                <div className="form-to">
                  {!isSpending ? <SpendingIcon /> : <WalletIcon />}
                  {/* <InputForm
                  name={INPUT_FORM.TO}
                  control={control}
                  errors={errors}
                  onlyNumber
                  className="input-form"
                  placeholder="To"
                /> */}
                  <div className="text-label">To</div>

                  <div className="text">
                    {!isSpending ? "Spending" : "Wallet"}
                  </div>
                </div>
              </div>
              <button
                className="switch-btn"
                type="button"
                onClick={handleSwitch}
              >
                <SwitchIcon />
              </button>
            </SwitchTransfer>
            <Select
              className="select-token"
              value={selectToken}
              style={{ width: "100%", marginTop: 24 }}
              label="Age"
              onChange={handleChange}
            >
              <MenuItem value={"MGEM"}>
                <img
                  style={{ width: 16, marginRight: 5 }}
                  src="/assets/images/gem-token.gif"
                  alt="loading..."
                />
                MGEM
              </MenuItem>
              <MenuItem value={"MP"}>
                <img
                  style={{ width: 16, marginRight: 5 }}
                  src="https://cdn.manekopet.xyz/token/mp/logo.png"
                  alt="loading..."
                />
                MP
              </MenuItem>
            </Select>
            <div className="input">
              <span>Amount</span>
              <div className="input-token">
                {/* <img
                style={{ width: 16, marginRight: 5 }}
                src="/assets/images/gem-token.gif"
                alt="loading..."
              /> */}
                <InputForm
                  name={INPUT_FORM.AMOUNT}
                  control={control}
                  errors={errors}
                  onlyNumber
                  className="input-form"
                  placeholder="Enter amount"
                />
              </div>
              <div
                className="all"
                onClick={() => {
                  setValue(
                    INPUT_FORM.AMOUNT,
                    +(+balanceToken / 10 ** decimalsToken).toFixed(6)
                  );
                }}
              >
                All
              </div>
            </div>
            <div className="balance">
              Available: {balanceDisplayer(+balanceToken / 10 ** decimalsToken)}{" "}
              {selectToken}
            </div>
          </div>
          <div
            onClick={() => {
              navigate("/history-wallet");
            }}
            className="view-history"
          >
            View history
          </div>
          <Button disabled={loading} type="submit" className="submit">
            {loading ? "Confirming..." : "Confirm"}
          </Button>
        </Wrapper>
      </form>
    </FormProvider>
  );
}

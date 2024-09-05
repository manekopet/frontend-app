import { ReactComponent as SolanaIcon } from "@/assets/svg/solana.svg";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";

import InputForm from "@/components/Form/InputForm";
import useAccounts from "@/hooks/useAccounts";
import useDebounce from "@/hooks/useDebounce";
import { useThrottle } from "@/hooks/useThrottle";
import useTokens from "@/hooks/useTokens";
import useTransfer from "@/hooks/useTransfer";
import { balanceDisplayer } from "@/utils/convert";
import { Button, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { useMemo, useState } from "react";
import { Wrapper } from "./styled";

enum INPUT_FORM {
  ADDRESS = "address",
  AMOUNT = "amount",
}

export default function FormWithdraw() {
  const { amount: balance, decimals } = useAccounts();
  const { gemToken, mpToken } = useTokens();
  const [selectToken, setSelectToken] = useState("MGEM");
  const {
    transferNativeToken,
    loading,
    transferToken,
    transferTokenWithoutFee,
  } = useTransfer();
  const isNative = selectToken === "SOL";
  const transferFunc = useMemo(() => {
    switch (selectToken) {
      case "SOL":
        return transferNativeToken;
      case "MGEM":
        return transferToken;
      case "MP":
        return transferTokenWithoutFee;
      default:
        return transferNativeToken;
    }
  }, [selectToken]);

  const balanceToken = useMemo(() => {
    switch (selectToken) {
      case "SOL":
        return balance;
      case "MGEM":
        return gemToken.balance;
      case "MP":
        return mpToken.balance;
      default:
        return "0";
    }
  }, [selectToken, gemToken.balance, mpToken.balance, balance]);

  const decimalsToken = useMemo(() => {
    switch (selectToken) {
      case "SOL":
        return decimals;
      case "MGEM":
        return gemToken.decimals;
      case "MP":
        return mpToken.decimals;
      default:
        return 0;
    }
  }, [selectToken]);
  // const balanceToken = selectToken === "SOL" ? balance : gemToken.balance;
  // const decimalsToken = selectToken === "SOL" ? decimals : gemToken.decimals;
  const schema = Yup.object({
    [INPUT_FORM.AMOUNT]: Yup.number()
      .transform((value) =>
        isNaN(value) || value === null || value === undefined ? 0 : value
      )
      .min(0.001, "Mint balance is 0.001")
      .max(999999, "Max balance to transfer is 999,999")
      .required("Required field"),
    [INPUT_FORM.ADDRESS]: Yup.string().required("Required field"),
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
    formState: { errors },
  } = methods;

  // const errorsTokens = errors[INPUT_FORM.TOKEN];
  useDebounce(
    async () => {
      // if (errorsTokens) return;
    },
    [],
    1000
  );
  const onSubmit = useThrottle(
    async (values: { address: string; amount: number }) => {
      console.log("🚀 ~ onSubmit ~ values:", values);
      await transferFunc(values.address, values.amount);
    },
    2000
  );
  const handleChange = (event: SelectChangeEvent) => {
    setSelectToken(event.target.value);
  };
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Wrapper>
          <div className="group-input">
            <p className="title">
              Transfer {selectToken} from your Maneko wallet to your other
              wallet on Solana
            </p>
            <Select
              className="select-token"
              value={selectToken}
              label="Age"
              onChange={handleChange}
            >
              <MenuItem value={"SOL"}>
                <SolanaIcon /> SOL
              </MenuItem>
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
              <InputForm
                name={INPUT_FORM.ADDRESS}
                control={control}
                errors={errors}
                className="input-form"
                placeholder="Enter address"
              />
            </div>
            <div className="input input-amount">
              <InputForm
                name={INPUT_FORM.AMOUNT}
                control={control}
                errors={errors}
                onlyNumber
                className="input-form"
                placeholder="Enter amount"
              />
              <div className="balance">
                Your balance:{" "}
                {balanceDisplayer(+balanceToken / 10 ** decimalsToken)}{" "}
                {isNative ? "SOL" : "MGEM"}
              </div>
            </div>
          </div>
          <Button disabled={loading} type="submit" className="submit">
            {loading ? "Transfering..." : "Transfer"}
          </Button>
        </Wrapper>
      </form>
    </FormProvider>
  );
}

import { ENVS } from "@/configs/Configs.env";

export const feeBasisPoints = +ENVS.REACT_APP_FEE_BASIS_POINTS;
export const feeCalculate = (transferAmount: bigint) =>
  (transferAmount * BigInt(feeBasisPoints)) / BigInt(10000);
export const maxFee = BigInt(+ENVS.REACT_APP_MAX_FEE);

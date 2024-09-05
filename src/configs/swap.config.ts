import { DEVNET_PROGRAM_ID, ProgramId } from "@raydium-io/raydium-sdk";
import { ENVS, isMainnet } from "./Configs.env";

interface ConfigSwap {
  targetPool: string;
  mpToken: string;
  wsol: string;
  programIds: ProgramId;
}

const configSwapDevnet: ConfigSwap = {
  targetPool: ENVS.REACT_APP_SWAP_POOL,
  mpToken: ENVS.REACT_APP_MGEM_TOKEN,
  wsol: "So11111111111111111111111111111111111111112",
  programIds: DEVNET_PROGRAM_ID,
};

const configSwapMainnet: ConfigSwap = {
  targetPool: ENVS.REACT_APP_SWAP_POOL,
  mpToken: ENVS.REACT_APP_MGEM_TOKEN,
  wsol: "So11111111111111111111111111111111111111112",
  programIds: DEVNET_PROGRAM_ID,
};

export const configSwap: ConfigSwap = isMainnet
  ? configSwapMainnet
  : configSwapDevnet;

import { ENVS } from "@/configs/Configs.env";
import { Connection } from "@solana/web3.js";

export const CONNECTION = new Connection(ENVS.REACT_APP_SOL_RPC, "confirmed");

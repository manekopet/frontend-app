import { ENVS } from "@/configs/Configs.env";
import { publicKey } from "@metaplex-foundation/umi";

export const creator = publicKey(ENVS.REACT_APP_MINT_CREATOR);
export const mpToken = publicKey(ENVS.REACT_APP_MGEM_TOKEN);
export const cmPubKey = publicKey(ENVS.REACT_APP_MINT_CANDY_MACHINE);
export const masterPubKey = publicKey(ENVS.REACT_APP_MINT_MASTER_PUBKEY);
export const tokenMetadataProgramId = publicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

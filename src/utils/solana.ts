import { SolanaWallet } from "@web3auth/solana-provider";
import base58 from "bs58";

export const getSignature = async (
  publicAddress: string,
  nonce: string,
  web3authProvider: any
) => {
  const solanaWallet = new SolanaWallet(web3authProvider);
  const msg = Buffer.from(`${nonce}`, "utf8");
  const res = await solanaWallet.signMessage(msg);
  const bytes = Uint8Array.from(res);
  const messageSignedBase58 = base58.encode(bytes);
  return messageSignedBase58;
};

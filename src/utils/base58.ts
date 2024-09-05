import * as web3 from "@solana/web3.js";
import bs58 from "bs58";

export function base58ToKeypair(base58PrivateKey: string): web3.Keypair {
  try {
    const base58privatekey = bs58.encode(Buffer.from(base58PrivateKey, "hex"));
    return web3.Keypair.fromSecretKey(bs58.decode(base58privatekey));
  } catch (error) {
    throw new Error("Invalid base58 private key.");
  }
}

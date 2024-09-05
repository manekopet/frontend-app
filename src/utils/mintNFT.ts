import { CONNECTION } from "@/functions";
import { umi } from "@/providers/AuthProvider";
import { TypeTransaction } from "@/types/transaction";
import {
  fetchCandyMachine,
  mintV2,
} from "@metaplex-foundation/mpl-candy-machine";
import {
  createAssociatedToken,
  setComputeUnitLimit,
  setComputeUnitPrice,
} from "@metaplex-foundation/mpl-toolbox";
import {
  Transaction,
  generateSigner,
  keypairIdentity,
  publicKey,
  some,
  transactionBuilder,
} from "@metaplex-foundation/umi";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import {
  TOKEN_2022_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import bs58 from "bs58";
import { PRIVATE_KEY_B58, gateProvider } from "./constants";
import transactionStorage from "./transactionStorage";
import { cmPubKey, creator, masterPubKey, mpToken } from "./umiOnchain";

async function getPriorityFeeEstimate(
  priorityLevel: string,
  transaction: Transaction
) {
  const response = await fetch(
    "https://mainnet.helius-rpc.com/?api-key=17e836d6-2e44-4d35-a15b-44a5230f3b4d",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "1",
        method: "getPriorityFeeEstimate",
        params: [
          {
            transaction: bs58.encode(umi.transactions.serialize(transaction)),
            options: { priorityLevel: priorityLevel },
          },
        ],
      }),
    }
  );
  const data = await response.json();
  console.log(
    "Fee in function for",
    priorityLevel,
    " :",
    data.result.priorityFeeEstimate
  );
  return data.result;
}

export const mintNFT = async (
  addressPublic: string,
  wallet?: WalletContextState
) => {
  try {
    const isGate = localStorage.getItem("GATE_CONNECT");
    if (isGate) {
      umi.use(walletAdapterIdentity(gateProvider as any));
    } else if (wallet) {
      umi.use(walletAdapterIdentity(wallet as any));
    } else {
      const privateKey = localStorage.getItem(PRIVATE_KEY_B58);
      if (!privateKey) {
        throw new Error("Account Not Found. Please try to login again");
      }
      const keypair = umi.eddsa.createKeypairFromSecretKey(
        Buffer.from(privateKey, "hex")
      );
      umi.use(keypairIdentity(keypair));
    }
    let builder = transactionBuilder().add(
      setComputeUnitLimit(umi, { units: 500_000 })
    );
    const signerAssociatedTokenAddress = getAssociatedTokenAddressSync(
      new PublicKey(mpToken.toString()),
      new PublicKey(addressPublic),
      false,
      TOKEN_2022_PROGRAM_ID
    );

    const account = await CONNECTION.getAccountInfo(
      signerAssociatedTokenAddress
    );

    console.log("account", account);
    if (!account) {
      console.log("Creating associated token account");
      builder = builder.add(
        createAssociatedToken(umi, {
          mint: mpToken,
          tokenProgram: publicKey(TOKEN_2022_PROGRAM_ID),
          ata: publicKey(signerAssociatedTokenAddress),
        })
      );
    }
    const cm = await fetchCandyMachine(umi, cmPubKey);
    const nftMint = generateSigner(umi);
    builder = builder.add(
      mintV2(umi, {
        candyMachine: cm.publicKey,
        nftMint,
        collectionMint: cm.collectionMint,
        collectionUpdateAuthority: creator,
        tokenStandard: cm.tokenStandard,
        mintArgs: {
          token2022Payment: some({
            mint: mpToken,
            destinationAta: masterPubKey,
          }),
        },
      })
    );
    builder = await builder.setLatestBlockhash(umi);
    console.log("🚀 ~ builder:", builder);
    const tx = await builder.buildAndSign(umi);
    console.log("🚀 ~ tx:", tx);
    const fee = await getPriorityFeeEstimate("High", tx);
    console.log("fee", fee);
    builder = builder.add(
      setComputeUnitPrice(umi, { microLamports: fee.priorityFeeEstimate })
    );

    console.log("Sending transaction");
    const res = await builder.sendAndConfirm(umi);
    console.log("res: ", res);

    transactionStorage.setTransactionStorage({
      hash: bs58.encode(umi.transactions.serialize(tx)),
      type: TypeTransaction.MINT,
      amount: 0,
      symbol: "MGEM",
      timestamp: Date.now(),
    });
    return nftMint.publicKey.toString();
  } catch (error: any) {
    const errMsg: string = error?.message || "";
    // "Transfer: insufficient lamports 2725840, need 15616720"
    if (errMsg.includes("insufficient") || errMsg.includes("Insufficient")) {
      throw Error(
        "Ops! something happen, please make sure your account enough sol for gas."
      );
    }
    throw Error(error.message);
  }
};

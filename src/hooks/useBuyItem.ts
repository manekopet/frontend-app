import { ENVS } from "@/configs/Configs.env";
import { CONNECTION } from "@/functions";
import { AuthContext } from "@/providers/AuthProvider";
import {
  TOKEN_2022_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  createTransferCheckedWithFeeInstruction,
  getAccount,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";

import {
  ComputeBudgetProgram,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";

import { ERROR_WALLET } from "@/utils/constants";
import { feeCalculate, maxFee } from "@/utils/solanaOnchain";
import { SolanaWallet } from "@web3auth/solana-provider";
import { useContext, useState } from "react";
import useAccounts from "./useAccounts";
import useTokens from "./useTokens";

export default function useBuyItem() {
  const { address } = useAccounts();
  const { provider, logout } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const {
    gemToken: { balance },
  } = useTokens();

  const buyItem = async (
    receiver: string,
    amount: number,
    orderId: string,
    itemId: string,
    nftId: string
  ): Promise<{ signature: string } | null> => {
    if (!address || !provider || loading) {
      throw Error("bad request, try again later 1");
    }
    if (+balance < amount) {
      throw Error(`Your balance is insufficient. Deposit now.`);
    }
    try {
      setLoading(true);
      const solana = new SolanaWallet(provider);
      const connection = CONNECTION;
      const mintToken = new PublicKey(ENVS.REACT_APP_MGEM_TOKEN);
      const publicKey = new PublicKey(address);
      const transactionInstructions: TransactionInstruction[] = [];
      const associatedTokenFrom = await getAssociatedTokenAddressSync(
        mintToken,
        publicKey,
        false,
        TOKEN_2022_PROGRAM_ID
      );
      const fromAccount = await getAccount(
        connection,
        associatedTokenFrom,
        undefined,
        TOKEN_2022_PROGRAM_ID
      );
      const recipientAddress = new PublicKey(receiver);
      const associatedTokenTo = await getAssociatedTokenAddressSync(
        mintToken,
        recipientAddress,
        false,
        TOKEN_2022_PROGRAM_ID
      );
      if (!(await connection.getAccountInfo(associatedTokenTo))) {
        transactionInstructions.push(
          createAssociatedTokenAccountInstruction(
            publicKey,
            associatedTokenTo,
            recipientAddress, // the token account to send to
            mintToken,
            TOKEN_2022_PROGRAM_ID
          )
        );
      }
      const transferAmount = BigInt(amount);

      const fee = feeCalculate(transferAmount);
      const feeCharged = fee > maxFee ? maxFee : fee;
      // BigInt(100000)
      transactionInstructions.push(
        createTransferCheckedWithFeeInstruction(
          fromAccount.address, // source
          mintToken,
          associatedTokenTo,
          publicKey,
          transferAmount, // transfer amount
          9,
          feeCharged,
          [],
          TOKEN_2022_PROGRAM_ID
        )
      );
      const memoInstruction = new TransactionInstruction({
        keys: [{ pubkey: publicKey, isSigner: true, isWritable: true }],
        data: Buffer.from(
          `itemid:${itemId} nftid:${nftId} orderid:${orderId}`,
          "utf-8"
        ),
        programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
      });
      transactionInstructions.push(memoInstruction);
      const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
        units: 800_000,
      });

      const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: 2_000_000,
      });
      const transaction = new Transaction()
        .add(modifyComputeUnits)
        .add(addPriorityFee)
        .add(...transactionInstructions);
      const blockHash = await connection.getLatestBlockhash();
      transaction.feePayer = publicKey;
      transaction.recentBlockhash = blockHash.blockhash;
      const { signature } = await solana.signAndSendTransaction(transaction);
      return { signature };
    } catch (error: any) {
      if (
        error?.data?.message?.includes(ERROR_WALLET.Method_Notfound) ||
        error?.data?.message?.includes("Method not found")
      ) {
        console.log("---12321312");
        logout();
      }

      throw Error(`Something wrong. Please try again or login again`);
    } finally {
      setLoading(false);
    }
  };

  return { buyItem, loading };
}

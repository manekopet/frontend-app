import { ENVS } from "@/configs/Configs.env";
import { CONNECTION } from "@/functions";
import {
  TOKEN_2022_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  createTransferCheckedWithFeeInstruction,
  getAccount,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import * as web3 from "@solana/web3.js";

import { createTransferInstruction } from "@/functions/createTransferInstructions";
import { AuthContext } from "@/providers/AuthProvider";
import { TypeTransaction } from "@/types/transaction";
import { base58ToKeypair } from "@/utils/base58";
import { PRIVATE_KEY_B58, gateProvider } from "@/utils/constants";
import { feeCalculate, maxFee } from "@/utils/solanaOnchain";
import transactionStorage from "@/utils/transactionStorage";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  ComputeBudgetProgram,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import useAccounts from "./useAccounts";
import useTokens from "./useTokens";

export default function useTransfer() {
  const { address } = useAccounts();
  const [loading, setLoading] = useState(false);
  const { gemToken, mpToken } = useTokens();
  const { isGate } = useContext(AuthContext);
  const { sendTransaction } = useWallet();

  const transferToken = async (receiver: string, amount: number) => {
    const privateKey = localStorage.getItem(PRIVATE_KEY_B58);

    if (!address || loading) return;
    try {
      setLoading(true);

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
      const transferAmount = BigInt(amount * 10 ** gemToken.decimals); // 15 MP

      const fee = feeCalculate(transferAmount);
      const feeCharged = fee > maxFee ? maxFee : fee;
      transactionInstructions.push(
        createTransferCheckedWithFeeInstruction(
          fromAccount.address,
          mintToken,
          associatedTokenTo,
          publicKey,
          transferAmount,
          9,
          feeCharged,
          [],
          TOKEN_2022_PROGRAM_ID
        )
      );
      const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
        units: 800_000,
      });

      const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: 600000,
      });
      const transaction = new Transaction()
        .add(modifyComputeUnits)
        .add(addPriorityFee)
        .add(...transactionInstructions);
      const blockHash = await connection.getLatestBlockhash();
      transaction.feePayer = publicKey;
      transaction.recentBlockhash = blockHash.blockhash;
      let signature = "";
      if (privateKey) {
        const fromWallet = base58ToKeypair(privateKey);
        signature = await web3.sendAndConfirmTransaction(
          connection,
          transaction,
          [fromWallet]
        );
      } else if (isGate) {
        const tx = await gateProvider.signAndSendTransaction(transaction);
        console.log("🚀 ~ depositToken ~ tx:", tx);
        signature = tx.signature;
      } else {
        signature = await sendTransaction(transaction, CONNECTION);
      }
      transactionStorage.setTransactionStorage({
        hash: signature,
        type: TypeTransaction.SEND,
        amount: amount,
        symbol: "MGEM",
        timestamp: Date.now(),
      });
      console.log("🚀 ~ signature:", signature);
      toast.success(`Transfer token success to account ${receiver}`);
    } catch (error: any) {
      console.log("🚀 ~ transferToken ~ error:", error);
      toast.error(error?.name || error?.message);
    } finally {
      setLoading(false);
    }
  };

  const transferTokenWithoutFee = async (receiver: string, amount: number) => {
    const privateKey = localStorage.getItem(PRIVATE_KEY_B58);
    if (!address || loading) return;
    try {
      setLoading(true);

      const connection = CONNECTION;
      const mintToken = new PublicKey(ENVS.REACT_APP_MP_TOKEN);
      const publicKey = new PublicKey(address);
      const transactionInstructions: TransactionInstruction[] = [];
      const associatedTokenFrom = await getAssociatedTokenAddressSync(
        mintToken,
        publicKey,
        false
      );
      const fromAccount = await getAccount(
        connection,
        associatedTokenFrom,
        undefined
      );
      const recipientAddress = new PublicKey(receiver);
      const associatedTokenTo = await getAssociatedTokenAddressSync(
        mintToken,
        recipientAddress,
        false
      );
      if (!(await connection.getAccountInfo(associatedTokenTo))) {
        transactionInstructions.push(
          createAssociatedTokenAccountInstruction(
            publicKey,
            associatedTokenTo,
            recipientAddress, // the token account to send to
            mintToken
          )
        );
      }

      transactionInstructions.push(
        createTransferInstruction(
          fromAccount.address,
          associatedTokenTo,
          publicKey,
          // transferAmount,
          amount * Math.pow(10, mpToken.decimals)
        )
      );

      const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
        units: 800_000,
      });

      const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: 600000,
      });
      const transaction = new Transaction()
        .add(modifyComputeUnits)
        .add(addPriorityFee)
        .add(...transactionInstructions);
      const blockHash = await connection.getLatestBlockhash();
      transaction.feePayer = publicKey;
      transaction.recentBlockhash = blockHash.blockhash;
      let signature = "";
      if (privateKey) {
        const fromWallet = base58ToKeypair(privateKey);
        signature = await web3.sendAndConfirmTransaction(
          connection,
          transaction,
          [fromWallet]
        );
      } else if (isGate) {
        const tx = await gateProvider.signAndSendTransaction(transaction);
        console.log("🚀 ~ depositToken ~ tx:", tx);
        signature = tx.signature;
      } else {
        signature = await sendTransaction(transaction, CONNECTION);
      }

      console.log("🚀 ~ signature:", signature);
      toast.success(`Transfer token success to account ${receiver}`);
    } catch (error: any) {
      console.log("🚀 ~ transferToken ~ error:", error);
      toast.error(error?.name || error?.message);
    } finally {
      setLoading(false);
    }
  };

  const transferNativeToken = async (receiver: string, amount: number) => {
    const privateKey = localStorage.getItem(PRIVATE_KEY_B58);

    // if (!privateKey) {
    //   toast.error("Account Not Found. Please try to login again");
    //   return;
    // }
    if (loading || !address) return;
    try {
      setLoading(true);

      const publicKey = new PublicKey(address);
      const toPubkey = new PublicKey(receiver);

      const TransactionInstruction = SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: toPubkey,
        lamports: amount * LAMPORTS_PER_SOL,
      });

      const transaction = new Transaction().add(TransactionInstruction);

      const blockHash = await CONNECTION.getLatestBlockhash();
      transaction.feePayer = publicKey;
      transaction.recentBlockhash = blockHash.blockhash;

      let signature = "";
      if (privateKey) {
        const fromWallet = base58ToKeypair(privateKey);
        signature = await web3.sendAndConfirmTransaction(
          CONNECTION,
          transaction,
          [fromWallet]
        );
      } else if (isGate) {
        const tx = await gateProvider.signAndSendTransaction(transaction);
        signature = tx.signature;
      } else {
        signature = await sendTransaction(transaction, CONNECTION);
      }
      console.log("🚀 ~ signature:", signature);
      toast.success(`Transfer token success to account ${receiver}`);
    } catch (error: any) {
      const message = error?.message;
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    transferToken,
    transferNativeToken,
    transferTokenWithoutFee,
    loading,
  };
}

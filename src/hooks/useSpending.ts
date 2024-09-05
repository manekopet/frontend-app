import * as depositApi from "@/apis/deposit";
import * as referApi from "@/apis/refer";
import { ENVS } from "@/configs/Configs.env";
import { CONNECTION } from "@/functions";
import { feeCalculate, maxFee } from "@/utils/solanaOnchain";
import {
  TOKEN_2022_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  createTransferCheckedWithFeeInstruction,
  getAccount,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import * as web3 from "@solana/web3.js";
import {
  ComputeBudgetProgram,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";

import { createTransferInstruction } from "@/functions/createTransferInstructions";
import { AuthContext } from "@/providers/AuthProvider";
import { appSelectors } from "@/redux/features/app/selectors";
import { TypeTransaction } from "@/types/transaction";
import { base58ToKeypair } from "@/utils/base58";
import { PRIVATE_KEY_B58, gateProvider } from "@/utils/constants";
import transactionStorage from "@/utils/transactionStorage";
import { useWallet } from "@solana/wallet-adapter-react";
import { useContext, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import useAccounts from "./useAccounts";
import useTokens from "./useTokens";

export default function useSpending() {
  const [loading, setLoading] = useState(false);
  const { gemToken, mpToken } = useTokens();
  const { address } = useAccounts();
  const { sendTransaction } = useWallet();
  const shoppingVaultAddress = useSelector(
    appSelectors.selectShoppingVaultAddress
  );
  const { isGate } = useContext(AuthContext);
  const depositToken = async (amount: number) => {
    const privateKey = localStorage.getItem(PRIVATE_KEY_B58);
    if (loading || !shoppingVaultAddress || !address) return; //!address ||
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
      const recipientAddress = new PublicKey(shoppingVaultAddress);
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
      // memo start
      const memoInstruction = new TransactionInstruction({
        keys: [{ pubkey: publicKey, isSigner: true, isWritable: true }],
        data: Buffer.from(
          `itemid:'deposit'`,
          // `itemid:'deposit' orderid:${userId}`,
          "utf-8"
        ),
        programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
      });
      transactionInstructions.push(memoInstruction);
      // memo end

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
      // const blockHash = await connection.getLatestBlockhash();
      transaction.feePayer = publicKey;
      transaction.recentBlockhash = (
        await connection.getRecentBlockhash()
      ).blockhash;
      // if(isLogin)
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
      if (!signature) {
        toast.error("Deposit MGEM Failed");
        return;
      }

      transactionStorage.setTransactionStorage({
        hash: signature as string,
        type: TypeTransaction.DEPOSIT,
        amount: amount,
        symbol: "MGEM",
        timestamp: Date.now(),
      });
      console.log("signature: ", signature);
      // const { signature } = await solana.signAndSendTransaction(transaction);
      await depositApi.depositToken(signature);
      toast.success("Deposit MGEM Successfully");
    } catch (error: any) {
      console.log("🚀 ~ transferToken ~ error:", error);
      toast.error(error?.message || error?.name);
    } finally {
      setLoading(false);
    }
  };
  const depositTokenWithoutFee = async (amount: number) => {
    const privateKey = localStorage.getItem(PRIVATE_KEY_B58);
    if (loading || !shoppingVaultAddress || !address) return; //!address ||
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
      const recipientAddress = new PublicKey(shoppingVaultAddress);
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
      // memo start
      const memoInstruction = new TransactionInstruction({
        keys: [{ pubkey: publicKey, isSigner: true, isWritable: true }],
        data: Buffer.from(
          `itemid:'deposit'`,
          // `itemid:'deposit' orderid:${userId}`,
          "utf-8"
        ),
        programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
      });
      transactionInstructions.push(memoInstruction);
      // memo end

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
      // const blockHash = await connection.getLatestBlockhash();
      transaction.feePayer = publicKey;
      transaction.recentBlockhash = (
        await connection.getRecentBlockhash()
      ).blockhash;
      // if(isLogin)
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
      if (!signature) {
        toast.error("Deposit MGEM Failed");
        return;
      }

      transactionStorage.setTransactionStorage({
        hash: signature as string,
        type: TypeTransaction.DEPOSIT,
        amount: amount,
        symbol: "MGEM",
        timestamp: Date.now(),
      });
      console.log("signature: ", signature);
      // const { signature } = await solana.signAndSendTransaction(transaction);
      await depositApi.depositToken(signature);
      toast.success("Deposit MGEM Successfully");
    } catch (error: any) {
      console.log("🚀 ~ transferToken ~ error:", error);
      toast.error(error?.message || error?.name);
    } finally {
      setLoading(false);
    }
  };

  const withDrawalToken = async ({
    itemId,
    amount,
  }: {
    amount: number;
    itemId: number;
  }) => {
    try {
      const { data } = await referApi.rewardsEarnClaimV2({
        itemId,
        amount,
      });
      if (data?.status === 0) {
        toast.error(data?.message || "Withdrawal failed");
      } else {
        toast.success("Withdrawal MGEM Successfully");
      }
    } catch (error: any) {
      console.log("🚀 ~ transferToken ~ error:", error);
      toast.error(error?.message);
    } finally {
      setLoading(false);
    }
  };

  return { depositToken, withDrawalToken, depositTokenWithoutFee, loading };
}

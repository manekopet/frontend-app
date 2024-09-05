import { getFaucet } from "@/apis/faucet";
import { ENVS } from "@/configs/Configs.env";
import { CONNECTION } from "@/functions";
import { createAssociatedTokenAccountInstruction } from "@/functions/createAssociatedTokenAccountInstruction";
import { AuthContext } from "@/providers/AuthProvider";
import {
  TOKEN_2022_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import {
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { SolanaWallet } from "@web3auth/solana-provider";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import useAccounts from "./useAccounts";

export default function useFaucet() {
  const { address } = useAccounts();
  const { provider } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const onFaucet = async () => {
    console.log("address: ", address, provider);
    if (!address || !provider || loading) return;
    try {
      setLoading(true);
      const solana = new SolanaWallet(provider);

      const connection = CONNECTION;
      const mintToken = new PublicKey(ENVS.REACT_APP_MGEM_TOKEN);
      const publicKey = new PublicKey(address);
      const transactionInstructions: TransactionInstruction[] = [];
      console.log("🚀 ~ onFaucet ~ ====:", transactionInstructions);
      const associatedTokenFrom = await getAssociatedTokenAddressSync(
        mintToken,
        publicKey,
        false,
        TOKEN_2022_PROGRAM_ID
      );
      console.log("🚀 ~ onFaucet ~ ===22=:", transactionInstructions);

      if (!(await connection.getAccountInfo(associatedTokenFrom))) {
        transactionInstructions.push(
          createAssociatedTokenAccountInstruction(
            publicKey,
            associatedTokenFrom,
            publicKey, // the token account to send to
            mintToken,
            TOKEN_2022_PROGRAM_ID
          )
        );
      }
      console.log("transactionInstructions: ", transactionInstructions);
      if (transactionInstructions.length) {
        const transaction = new Transaction().add(...transactionInstructions);
        const blockHash = await connection.getLatestBlockhash();
        transaction.feePayer = publicKey;
        transaction.recentBlockhash = blockHash.blockhash;
        await solana.signAndSendTransaction(transaction);
      }
      await getFaucet(address);
      toast.success("Request faucet successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || error?.name || error?.message);
    } finally {
      setLoading(false);
    }
  };

  return { onFaucet, loading };
}

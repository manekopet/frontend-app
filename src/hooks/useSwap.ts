import { CONNECTION } from "@/functions";
import { AuthContext } from "@/providers/AuthProvider";
import { TypeTransaction } from "@/types/transaction";
import { ERROR_WALLET, gateProvider } from "@/utils/constants";
import { estTokenAmountOut, sendTx, swapTokens } from "@/utils/swapTokens";
import transactionStorage from "@/utils/transactionStorage";
import { useWallet } from "@solana/wallet-adapter-react";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import useAccounts from "./useAccounts";
import useReloadBalance from "./useReloadBalance";

interface IProps {
  inputNumber: number;
  isDirection: boolean;
}

export default function useSwap() {
  const { logout, isSocialLogin, isGate } = useContext(AuthContext);
  const { sendTransaction } = useWallet();
  const { address } = useAccounts();
  useReloadBalance(8000);
  const [isSwapping, setIsSwapping] = useState(false);
  const handleSwap = async (props: IProps) => {
    if (isSwapping) return;
    const { inputNumber, isDirection } = props;
    if (!address) {
      toast.error("Address or Provider not found!");
      return;
    }

    setIsSwapping(true);
    try {
      const txs = await swapTokens({
        owner: address,
        inputNumber,
        isDirectionRevert: isDirection,
      });
      // console.log("🚀 ~ handleSwap ~ swaps:", swaps);

      // if (swaps.length > 0) {
      //   transactionStorage.setTransactionStorage({
      //     hash: swaps[0],
      //     type: TypeTransaction.SWAP,
      //     amount: inputNumber,
      //     symbol: isDirection ? "SOL" : "MGEM",
      //     timestamp: Date.now(),
      //   });
      // }
      let swaps = [];
      if (isSocialLogin) {
        swaps = await sendTx(txs);
        console.log("🚀 ~ handleSwap ~ swaps:", swaps);
        if (swaps.length > 0) {
          transactionStorage.setTransactionStorage({
            hash: swaps[0],
            type: TypeTransaction.SWAP,
            amount: inputNumber,
            symbol: isDirection ? "SOL" : "MGEM",
            timestamp: Date.now(),
          });
        }
      } else if (isGate) {
        const resolves = txs.map(async (iTx) => {
          console.log("🚀 ~ resolves ~ iTx:", iTx);
          const sig = await gateProvider.signAndSendTransaction(iTx);
          await CONNECTION.confirmTransaction(sig, "confirmed");
          return sig;
        });
        swaps = await Promise.all(resolves);
        console.log("🚀 ~ WALLET ~ swaps:", swaps);
      } else {
        const resolves = txs.map(async (iTx) => {
          const sig = await sendTransaction(iTx, CONNECTION, {});
          await CONNECTION.confirmTransaction(sig, "confirmed");
          return sig;
        });
        swaps = await Promise.all(resolves);
        console.log("🚀 ~ WALLET ~ swaps:", swaps);
      }
      if (swaps.length > 0) {
        transactionStorage.setTransactionStorage({
          hash: swaps[0],
          type: TypeTransaction.SWAP,
          amount: inputNumber,
          symbol: isDirection ? "SOL" : "MGEM",
          timestamp: Date.now(),
        });
      }
      toast.success("Token Swapped Successfully");
    } catch (error: any) {
      console.error("🚀 ~ handleSwap ~ error:", error);
      const message: string = error?.data?.message || error?.message;
      if (
        message === ERROR_WALLET.UninitializedWalletAdapterError ||
        message.includes(ERROR_WALLET.Method_Notfound)
      ) {
        logout();
      }
      toast.error(message);
    } finally {
      setIsSwapping(false);
    }
  };
  return { handleSwap, estTokenAmountOut, isSwapping };
}

import { useDispatch } from "@/hooks/redux";
import { AuthContext } from "@/providers/AuthProvider";
import { appSelectors } from "@/redux/features/app/selectors";
import authSlice from "@/redux/features/auth/slice";
import { syncNewPetAsync } from "@/redux/features/pet/saga";
import { petSelectors } from "@/redux/features/pet/selectors";
import { ERROR_WALLET } from "@/utils/constants";
import { mintNFT } from "@/utils/mintNFT";
import { useWallet } from "@solana/wallet-adapter-react";
import { useCallback, useContext, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import useAccounts from "./useAccounts";
import useTokens from "./useTokens";

export default function useMintNft() {
  const [isMinting, setIsMinting] = useState(false);
  const wallet = useWallet();
  const dispatch = useDispatch();
  const global = useSelector(appSelectors.selectGlobal);
  const { provider, isSocialLogin, logout } = useContext(AuthContext);
  const pets = useSelector(petSelectors.selectPets);
  const { address } = useAccounts();

  const { gemToken } = useTokens();
  const balance = useMemo(() => {
    return +gemToken.balance / 10 ** gemToken.decimals;
  }, [gemToken]);
  const onMintNft = useCallback(async () => {
    setIsMinting(true);
    let nftId = "";
    if (!address) {
      toast.error("Address not found");
      return;
    }
    try {
      // if (balance < (global?.mintPrice || 1)) {
      //   toast.error("Your MGEM balance is insufficient. Deposit now.");
      //   return;
      // }
      if (isSocialLogin) {
        nftId = await mintNFT(address);
      } else {
        nftId = await mintNFT(address, wallet);
      }
      if (pets.length < 1) {
        dispatch(authSlice.actions.setIsJustMint(true));
      }
      // Get list my pet
      dispatch(syncNewPetAsync({ nftPublicKey: nftId }));
      toast.success("Mint NFT Successfully");
    } catch (error: any) {
      const message = error?.message;
      if (
        message === ERROR_WALLET.UninitializedWalletAdapterError ||
        message?.includes("The current wallet adapter is not initialized.")
      ) {
        logout();
        return;
      }
      toast.error(message);
    } finally {
      setIsMinting(false);
    }
    return nftId;
  }, [balance, global?.mintPrice, isSocialLogin, dispatch, provider, wallet]);

  return { onMintNft, isMinting };
}

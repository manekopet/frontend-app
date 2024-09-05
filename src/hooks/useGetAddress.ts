import { AuthContext } from "@/providers/AuthProvider";
import { accountActions } from "@/redux/features/account/slice";
import { authSelector } from "@/redux/features/auth/selectors";
import { gateProvider } from "@/utils/constants";
import { useWallet } from "@solana/wallet-adapter-react";
import { useContext, useEffect } from "react";
import { useSelector } from "react-redux";
import SolanaRpc from "../components/WalletModal/solonaRPC";
import { useDispatch } from "./redux";

export default function useGetAddress() {
  const { provider, isSocialLogin, isLogined } = useContext(AuthContext);
  const wallet = useWallet();
  const accessToken = useSelector(authSelector.selectAccessToken);
  const dispatch = useDispatch();
  const { isGate } = useContext(AuthContext);

  const fetchingAddress = async () => {
    console.log(
      "🚀 ~ fetchingAddress ~ isGate:",
      isGate,
      gateProvider?.publicKey
    );
    try {
      if (!provider || !isLogined) return;
      if (isSocialLogin) {
        const rpc = new SolanaRpc(provider);
        const addresses: string[] = await rpc.getAccounts();
        if (addresses.length) {
          dispatch(
            accountActions.getAddressAccountSuccess({
              address: addresses[0],
            })
          );
        }
      } else {
        if (isGate) {
          console.log(
            "gateProvider?.publicKey?.toString(),: ",
            gateProvider?.publicKey?.toString()
          );
          dispatch(
            accountActions.getAddressAccountSuccess({
              address: gateProvider?.publicKey?.toString(),
            })
          );
          return;
        }

        dispatch(
          accountActions.getAddressAccountSuccess({
            address: wallet.publicKey?.toString(),
          })
        );
      }
    } catch (error) {
      console.log(
        "🚀 ~ file: useGetBalances.ts:17 ~ fetchingBalance ~ error:",
        error
      );
    }
  };

  useEffect(() => {
    fetchingAddress();
  }, [accessToken, provider, isGate]);

  return { fetchingAddress };
}

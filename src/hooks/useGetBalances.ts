import { CONNECTION } from "@/functions";
import { fetchBalances } from "@/functions/getBalanceTokens";
import { AuthContext } from "@/providers/AuthProvider";
import { accountSelectors } from "@/redux/features/account/selectors";
import { accountActions } from "@/redux/features/account/slice";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useCallback, useContext } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "./redux";

function useGetBalances() {
  const { web3auth } = useContext(AuthContext);
  const address = useSelector(accountSelectors.selectAddress);
  const dispatch = useDispatch();
  const fetchingBalance = useCallback(async () => {
    try {
      if (!web3auth || !address) return;
      dispatch(accountActions.getBalanceTokens());
      const ownerPublicKey = new PublicKey(address);
      const balance = await CONNECTION.getBalance(ownerPublicKey);
      const tokens = await fetchBalances({ owner: address });
      dispatch(
        accountActions.getBalanceTokensSuccess({
          tokens: tokens.balances,
          balanceAccount: {
            amount: balance.toString(),
            decimals: LAMPORTS_PER_SOL.toString().length - 1,
            uiAmount: null,
          },
        })
      );
    } catch (error) {
      console.log(
        "🚀 ~ file: useGetBalances.ts:17 ~ fetchingBalance ~ error:",
        error
      );
      dispatch(accountActions.getBalanceTokensFailed());
    }
  }, [web3auth, address]);

  return { fetchingBalance };
}
export default useGetBalances;

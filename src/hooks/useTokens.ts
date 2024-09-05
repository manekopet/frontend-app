import { ENVS } from "@/configs/Configs.env";
import { accountSelectors } from "@/redux/features/account/selectors";
import { ISymbol } from "@/types/auth";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function useTokens() {
  const tokens = useSelector(accountSelectors.selectTokens);
  const [gemToken, setGemToken] = useState({
    balance: "0",
    decimals: 1,
    symbol: ISymbol.MGEM,
  });
  const [mpToken, setMpToken] = useState({
    balance: "0",
    decimals: 1,
    symbol: ISymbol.MP,
  });
  useEffect(() => {
    const mgem = tokens[ENVS.REACT_APP_MGEM_TOKEN];
    const mp = tokens[ENVS.REACT_APP_MP_TOKEN];
    if (mgem) {
      setGemToken({
        balance: mgem.amount,
        decimals: mgem.decimals,
        symbol: ISymbol.MGEM,
      });
    }

    if (mp) {
      setMpToken({
        balance: mp.amount,
        decimals: mp.decimals,
        symbol: ISymbol.MGEM,
      });
    }
  }, [tokens]);
  return { gemToken, mpToken };
}

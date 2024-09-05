import {
  startWatchingWalletAsync,
  stopWatchingWalletAsync,
} from "@/redux/features/account/saga";
import { useEffect } from "react";
import { useDispatch } from "./redux";

export default function useReloadBalance(delay: number) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(startWatchingWalletAsync(delay));
    return () => {
      dispatch(stopWatchingWalletAsync());
    };
  }, [dispatch, delay]);
}

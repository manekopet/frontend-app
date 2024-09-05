import {
  startWatchingAccountBalanceAsync,
  stopWatchingAccountBalanceAsync,
} from "@/redux/features/auth/saga";
import { useEffect } from "react";
import { useDispatch } from "./redux";

export default function useReloadAccountBalance(delay: number) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(startWatchingAccountBalanceAsync(delay));
    return () => {
      dispatch(stopWatchingAccountBalanceAsync());
    };
  }, [dispatch, delay]);
}

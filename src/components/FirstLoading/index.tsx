import { useDispatch } from "@/hooks/redux";
import useGetAddress from "@/hooks/useGetAddress";
import useGlobal from "@/hooks/useGlobal";
import authSlice from "@/redux/features/auth/slice";
import { useEffect } from "react";

export default function FirstLoading() {
  const dispatch = useDispatch();
  useGlobal();
  useGetAddress();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("referral");
    if (code) {
      dispatch(authSlice.actions.setReferral(code));
    }
  });

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     fetchingBalance();
  //   }, 10 * 1000);
  //   return () => clearInterval(intervalId);
  // }, [web3auth, address, fetchingBalance]);
  return <></>;
}

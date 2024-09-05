import * as publicApi from "@/apis/public";
import { appSelectors } from "@/redux/features/app/selectors";
import appSlice from "@/redux/features/app/slice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "./redux";

export default function useGlobal() {
  const dispatch = useDispatch();
  const global = useSelector(appSelectors.selectGlobal);
  useEffect(() => {
    const fetchGlobal = async () => {
      const global = await publicApi.global();
      dispatch(appSlice.actions.setGlobal(global));
    };

    fetchGlobal();
  }, []);
  return global;
}

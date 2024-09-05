import { accountSelectors } from "@/redux/features/account/selectors";
import { useSelector } from "react-redux";

function useAccounts() {
  const address = useSelector(accountSelectors.selectAddress);
  const { decimals, amount } = useSelector(accountSelectors.selectBalance);
  const isFetching = useSelector(accountSelectors.selectIsFetching);
  return { address, decimals, amount, isFetching };
}
export default useAccounts;

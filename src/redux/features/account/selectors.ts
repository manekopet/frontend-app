import { ReduxPersistVersion } from "@/redux/root-reducer";
import { RootState } from "@/redux/store";
import { AccountState } from "@/types/accounts";
import { AuthState } from "@/types/auth";
import { createSelector } from "@reduxjs/toolkit";

const selectorDomain = (state: RootState): AccountState =>
  state[`account-${ReduxPersistVersion}`];

const selectorAuthDomain = (state: RootState): AuthState =>
  state[`auth-${ReduxPersistVersion}`];

const selectAddress = createSelector(
  selectorAuthDomain,
  (state) => state.user?.publicAddress
);
const selectBalance = createSelector(
  selectorDomain,
  (state) => state.balanceAccount
);
const selectTokens = createSelector(selectorDomain, (state) => state.tokens);
const selectIsFetching = createSelector(
  selectorDomain,
  (state) => state.isFetching
);

export const accountSelectors = {
  selectorDomain,
  selectAddress,
  selectTokens,
  selectBalance,
  selectIsFetching,
};

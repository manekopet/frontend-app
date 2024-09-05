import { ReduxPersistVersion } from "@/redux/root-reducer";
import { AuthState } from "@/types/auth";
import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../store";

const selectorDomain = (state: RootState): AuthState =>
  state[`auth-${ReduxPersistVersion}`];
const selectAccessToken = createSelector(
  selectorDomain,
  (state) => state.accessToken
);
const selectIsFinishOnboarding = createSelector(
  selectorDomain,
  (state) => state.isFinishOnboarding
);
const selectUser = createSelector(selectorDomain, (state) => state.user);
const selectBalance = createSelector(selectorDomain, (state) => state.balance);

const selectSocialData = createSelector(
  selectorDomain,
  (state) => state.socialData
);

export const authSelector = {
  selectorDomain,
  selectAccessToken,
  selectIsFinishOnboarding,
  selectUser,
  selectBalance,
  selectSocialData,
};

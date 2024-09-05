import { ReduxPersistVersion } from "@/redux/root-reducer";
import { AppState } from "@/types/app";
import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../store";

const selectorDomain = (state: RootState): AppState =>
  state[`app-${ReduxPersistVersion}`];

const selectFeedItems = createSelector(selectorDomain, (state) =>
  state.global?.feedItems.filter((item) => item.itemType === 1)
);
const selectShopItems = createSelector(selectorDomain, (state) =>
  state.global?.feedItems.filter((item) => item.itemType === 2)
);
const selectSpinBoard = createSelector(
  selectorDomain,
  (state) => state.global?.spinBoard
);
const selectShoppingVaultAddress = createSelector(
  selectorDomain,
  (state) => state.global?.shopping_vault_address
);
const selectGlobal = createSelector(selectorDomain, (state) => state.global);
const selectMute = createSelector(selectorDomain, (state) => state.config.mute);
const selectReward = createSelector(selectorDomain, (state) => state.reward);
export const appSelectors = {
  selectorDomain,
  selectFeedItems,
  selectShopItems,
  selectSpinBoard,
  selectShoppingVaultAddress,
  selectGlobal,
  selectMute,
  selectReward,
};

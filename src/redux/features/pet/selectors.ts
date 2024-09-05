import { ReduxPersistVersion } from "@/redux/root-reducer";
import { RootState } from "@/redux/store";
import { PetStateRedux } from "@/types/pet";
import { createSelector } from "@reduxjs/toolkit";

const selectorDomain = (state: RootState): PetStateRedux =>
  state[`pet-${ReduxPersistVersion}`];

const selectActivePet = createSelector(
  selectorDomain,
  (state) => state.activePet
);
const selectPets = createSelector(selectorDomain, (state) => state.pets);

export const petSelectors = {
  selectorDomain,
  selectActivePet,
  selectPets,
};

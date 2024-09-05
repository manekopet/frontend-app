import { ReduxPersistVersion } from "@/redux/root-reducer";
import { RootState } from "@/redux/store";
import { OnboardingState } from "@/types/onboarding";
import { createSelector } from "@reduxjs/toolkit";

const selectorDomain = (state: RootState): OnboardingState =>
  state[`onboarding-${ReduxPersistVersion}`];

const selectCurrentStep = createSelector(
  selectorDomain,
  (state) => state.currentStep
);
const selectFinishStep = createSelector(
  selectorDomain,
  (state) => state.isFinished
);

export const onboardingSelectors = {
  selectorDomain,
  selectCurrentStep,
  selectFinishStep,
};

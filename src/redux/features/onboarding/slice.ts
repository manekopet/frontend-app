import { OnboardingState } from "@/types/onboarding";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: OnboardingState = {
  currentStep: 0,
  isFinished: false,
};

const onboardingSlice = createSlice({
  name: "onboarding",
  initialState,
  reducers: {
    setStep(state, action: PayloadAction<{ step: number }>) {
      state.currentStep = action.payload.step;
    },
    setFinished(state, _: PayloadAction) {
      state.isFinished = true;
    },
    resetState() {
      return initialState;
    },
  },
});

export const onboardingActions = onboardingSlice.actions;

export default onboardingSlice;

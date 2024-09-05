import { AppState, GlobalConfig } from "@/types/app";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

// Define the initial state for this slice
const initialState: AppState = {
  global: null,
  config: { mute: false },
  reward: {
    modal: false,
    points: 0,
    symbol: "PTS",
  },
};

const appSlice = createSlice({
  name: "app", // Name of the slice
  initialState, // Initial state
  reducers: {
    setGlobal(state, action: PayloadAction<GlobalConfig>) {
      state.global = action.payload;
    },

    mute(state) {
      state.config = { ...state.config, mute: true };
    },
    unmute(state) {
      state.config = { ...state.config, mute: false };
    },

    showRewardModal(
      state,
      action: PayloadAction<{
        points: number;
        symbol: string;
      }>
    ) {
      state.reward.points = action.payload.points;
      state.reward.symbol = action.payload.symbol;
      state.reward.modal = true;
    },
    closeRewardModal(state) {
      state.reward.modal = false;
    },
  },
});

export default appSlice;

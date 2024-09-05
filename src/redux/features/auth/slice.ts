import { ReduxPersistVersion } from "@/redux/root-reducer";
import { User } from "@/types/user";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { REHYDRATE } from "redux-persist";
import {
  AuthAccount,
  AuthState,
  AuthStateBalance,
  ISymbol,
  SocialData,
} from "../../../types/auth";

// Define the initial state for this slice
const initialState: AuthState = {
  isFinishOnboarding: false,
  isJustMint: false,
  referral: "",
  account: null,
  accessToken: "",
  user: null,
  signed: 0,
  balance: {
    [ISymbol.MGEM]: {
      id: -1,
      name: ISymbol.MGEM,
      symbol: ISymbol.MGEM,
      Address: "",
      balance: 0,
      interest: 0,
      status: 0,
      itemId: -1,
    },
    [ISymbol.MP]: {
      id: -1,
      name: ISymbol.MGEM,
      symbol: ISymbol.MGEM,
      Address: "",
      balance: 0,
      interest: 0,
      status: 0,
      itemId: -1,
    },
  },
  socialData: null,
};

const authSlice = createSlice({
  name: "auth", // Name of the slice
  initialState, // Initial state
  reducers: {
    setAccount(state, action: PayloadAction<{ account: AuthAccount }>) {
      state.account = { ...action.payload.account };
    },

    loginSuccess(
      state,
      action: PayloadAction<{
        accessToken: string;
        user: User;
        signed?: number;
        balance: AuthStateBalance[];
        socialData?: SocialData;
      }>
    ) {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      // state.balance = action.payload.balance;
      state.signed = action.payload.signed || 0;
      state.socialData = action.payload.socialData || null;
      const balance = { ...state.balance };
      action.payload.balance.forEach((element) => {
        balance[element.symbol as ISymbol] = element;
      });
      state.balance = { ...balance };
    },
    updateBalance(
      state,
      action: PayloadAction<{
        balance: AuthStateBalance[];
      }>
    ) {
      const balance = { ...state.balance };
      action.payload.balance.forEach((element) => {
        balance[element.symbol as ISymbol] = element;
      });
      action.payload.balance.forEach((element) => {
        balance[element.symbol as ISymbol] = element;
      });
      state.balance = { ...balance };
    },
    clearAuth() {
      return initialState;
    },

    setReferral(state, action: PayloadAction<string>) {
      state.referral = action.payload;
    },

    setFinishedOnboarding(state) {
      state.isFinishOnboarding = true;
    },
    setIsJustMint(state, action: PayloadAction<boolean>) {
      state.isJustMint = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(REHYDRATE, (state, action: any) => {
      console.log("🚀 ~ builder.addCase ~ action:", action);
      if (
        action &&
        action.payload &&
        action.payload[`auth-${ReduxPersistVersion}`]
      ) {
        const accessToken =
          action.payload[`auth-${ReduxPersistVersion}`].accessToken;
        if (accessToken) {
          window.token = accessToken;
        }
      }
    });
  },
});

export default authSlice;

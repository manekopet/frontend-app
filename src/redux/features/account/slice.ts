import { AccountState, TBalance } from "@/types/accounts";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { LAMPORTS_PER_SOL, TokenAmount } from "@solana/web3.js";

export const balanceInitialState: AccountState = {
  balanceAccount: {
    amount: "0",
    decimals: LAMPORTS_PER_SOL,
    uiAmount: null,
  },
  tokens: {},
};

export const accountSlice = createSlice({
  name: "account",
  initialState: balanceInitialState,
  reducers: {
    getBalanceTokens(state: AccountState, _action: PayloadAction<undefined>) {
      return {
        ...state,
        isFetching: true,
      };
    },
    getBalanceTokensSuccess(
      state: AccountState,
      action: PayloadAction<TBalance>
    ) {
      return {
        ...state,
        ...action.payload,
        isFetching: false,
      };
    },
    getBalanceTokensFailed(
      state: AccountState,
      _action: PayloadAction<undefined>
    ) {
      return {
        ...state,
        isFetching: false,
      };
    },
    getAddressAccountSuccess(
      state: AccountState,
      action: PayloadAction<{
        address?: string;
      }>
    ) {
      state.address = action.payload.address;
      // set(state, "address", action.payload.address);
    },

    getAccountBalance(state) {
      state.isFetching = true;
    },
    getAccountBalanceSuccess(state, action: PayloadAction<{ amount: string }>) {
      state.isFetching = false;
      state.balanceAccount = {
        ...state.balanceAccount,
        amount: action.payload.amount,
      };
    },
    getAccountBalanceFailed(state) {
      state.isFetching = false;
    },
    getTokensBalance(state) {
      state.isFetching = true;
    },
    getTokensBalanceSuccess(
      state,
      action: PayloadAction<{ tokens: Record<string, TokenAmount> }>
    ) {
      state.isFetching = false;
      state.tokens = action.payload.tokens;
    },
    getTokensBalanceFailed(state) {
      state.isFetching = false;
    },
    resetState() {
      return balanceInitialState;
    },
  },
});

export const accountActions = accountSlice.actions;

export default accountSlice;

import { ENVS } from "@/configs/Configs.env";
import { CONNECTION } from "@/functions";
import { createAction } from "@reduxjs/toolkit";
import { LAMPORTS_PER_SOL, PublicKey, TokenAmount } from "@solana/web3.js";
import {
  call,
  cancel,
  delay,
  fork,
  put,
  select,
  take,
  takeLatest,
} from "redux-saga/effects";
import { accountSelectors } from "./selectors";
import accountSlice from "./slice";

export const startWatchingWalletAsync = createAction<number>(
  "account/startWatchingWalletAsync"
);
export const stopWatchingWalletAsync = createAction(
  "account/stopWatchingWalletAsync"
);
export const syncAccountBalanceAsync = createAction(
  "account/syncAccountBalanceAsync"
);
export const syncTokensBalanceAsync = createAction(
  "account/syncTokensBalanceAsync"
);

export const fetchTokenBalances = async (
  address: string
): Promise<Record<string, TokenAmount>> => {
  const tokens: Record<string, TokenAmount> = {};
  const ownerPublicKey = new PublicKey(address);

  try {
    const tokenPublicKey = new PublicKey(ENVS.REACT_APP_MGEM_TOKEN);
    const parsedTokens = await CONNECTION.getParsedTokenAccountsByOwner(
      ownerPublicKey,
      {
        mint: tokenPublicKey,
      }
    );
    parsedTokens.value.forEach(({ account }) => {
      if (
        account.data.parsed.info.mint.toLowerCase() ===
        ENVS.REACT_APP_MGEM_TOKEN.toLowerCase()
      ) {
        tokens[ENVS.REACT_APP_MGEM_TOKEN] =
          account.data.parsed.info.tokenAmount;
      }
    });
  } catch (err) {}
  try {
    const tokenPublicKey = new PublicKey(ENVS.REACT_APP_MP_TOKEN);
    const parsedTokens = await CONNECTION.getParsedTokenAccountsByOwner(
      ownerPublicKey,
      {
        mint: tokenPublicKey,
      }
    );
    parsedTokens.value.forEach(({ account }) => {
      if (
        account.data.parsed.info.mint.toLowerCase() ===
        ENVS.REACT_APP_MP_TOKEN.toLowerCase()
      ) {
        tokens[ENVS.REACT_APP_MP_TOKEN] = account.data.parsed.info.tokenAmount;
      }
    });
  } catch (err) {
    console.log("🚀 ~ err:", err);
  }
  return tokens;
};

export const fetchWalletBalance = async (address: string): Promise<number> => {
  const ownerPublicKey = new PublicKey(address);
  return CONNECTION.getBalance(ownerPublicKey);
};

function* watchingWallet(timeout: number) {
  while (true) {
    const walletAddress = accountSelectors.selectAddress(yield select());
    if (walletAddress) {
      yield put(accountSlice.actions.getBalanceTokens());
      try {
        const tokens: Record<string, TokenAmount> = yield call(
          fetchTokenBalances,
          walletAddress
        );
        const balance: number = yield call(fetchWalletBalance, walletAddress);

        yield put(
          accountSlice.actions.getBalanceTokensSuccess({
            tokens: tokens,
            balanceAccount: {
              amount: balance.toString(),
              decimals: LAMPORTS_PER_SOL.toString().length - 1,
              uiAmount: null,
            },
          })
        );
      } catch (e) {
        yield put(accountSlice.actions.getBalanceTokensFailed());
      } finally {
      }
    }

    yield delay(timeout);
  }
}

function* syncAccountBalanceSaga() {
  const walletAddress = accountSelectors.selectAddress(yield select());
  if (walletAddress) {
    yield put(accountSlice.actions.getAccountBalance());
    try {
      const balance: number = yield call(fetchWalletBalance, walletAddress);
      yield put(
        accountSlice.actions.getAccountBalanceSuccess({
          amount: balance.toString(),
        })
      );
    } catch (e) {
      yield put(accountSlice.actions.getAccountBalanceFailed());
    }
  }
}

function* syncTokensBalanceSaga() {
  const walletAddress = accountSelectors.selectAddress(yield select());
  if (walletAddress) {
    yield put(accountSlice.actions.getTokensBalance());
    try {
      const tokens: Record<string, TokenAmount> = yield call(
        fetchTokenBalances,
        walletAddress
      );
      yield put(
        accountSlice.actions.getTokensBalanceSuccess({
          tokens,
        })
      );
    } catch (e) {
      yield put(accountSlice.actions.getTokensBalanceFailed());
    }
  }
}

function* watchingWalletSaga(): any {
  while (true) {
    const action: ReturnType<typeof startWatchingWalletAsync> = yield take(
      startWatchingWalletAsync
    );
    // starts the task in the background
    const watchingTask = yield fork(watchingWallet, action.payload);

    // wait for the user stop action
    yield take(stopWatchingWalletAsync);
    // user clicked stop. cancel the background task
    // this will cause the forked bgSync task to jump into its finally block
    yield cancel(watchingTask);
  }
}

export function* accountSaga() {
  yield fork(watchingWalletSaga);
  yield takeLatest(syncAccountBalanceAsync, syncAccountBalanceSaga);
  yield takeLatest(syncTokensBalanceAsync, syncTokensBalanceSaga);
}

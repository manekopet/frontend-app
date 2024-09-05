import * as authApi from "@/apis/auth";
import * as nftPetApi from "@/apis/nft-pet";
import { AuthStateBalance } from "@/types/auth";
import { PetWithState } from "@/types/pet";
import { createAction } from "@reduxjs/toolkit";
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
import accountSlice from "../account/slice";
import onboardingSlice from "../onboarding/slice";
import { petSelectors } from "../pet/selectors";
import petSlice from "../pet/slice";
import { authSelector } from "./selectors";
import authSlice from "./slice";
export const logoutAsync = createAction("auth/logoutAsync");

export const syncActivePetPointsAsync = createAction(
  "auth/syncActivePetPointsAsync"
);

export const startWatchingAccountBalanceAsync = createAction<number>(
  "account/startWatchingAccountBalanceAsync"
);
export const stopWatchingAccountBalanceAsync = createAction(
  "account/stopWatchingAccountBalanceAsync"
);

function* logoutSaga() {
  yield put(authSlice.actions.clearAuth());
  yield put(petSlice.actions.resetState());
  yield put(accountSlice.actions.resetState());
  yield put(onboardingSlice.actions.resetState());
}

function* syncActivePetPointsSaga() {
  const activePet = petSelectors.selectActivePet(yield select());
  if (activePet) {
    try {
      const pet: PetWithState = yield call(
        nftPetApi.getMyPet,
        activePet.pet?.nftId
      );
      yield put(
        petSlice.actions.activePet({
          pet,
        })
      );
    } catch (e) {}
  }
}

function* watchingAccountBalance(interval: number) {
  while (true) {
    const user = authSelector.selectUser(yield select());
    if (user) {
      try {
        const profile: { balance: AuthStateBalance[] } = yield call(
          authApi.getProfile
        );

        yield put(
          authSlice.actions.updateBalance({
            balance: profile.balance,
          })
        );
      } catch (e) {
        console.log(e);
      } finally {
      }
    }

    yield delay(interval);
  }
}

function* watchingAccountBalanceSaga(): any {
  while (true) {
    const action: ReturnType<typeof startWatchingAccountBalanceAsync> =
      yield take(startWatchingAccountBalanceAsync);
    // starts the task in the background
    const watchingTask = yield fork(watchingAccountBalance, action.payload);

    // wait for the user stop action
    yield take(stopWatchingAccountBalanceAsync);
    // user clicked stop. cancel the background task
    // this will cause the forked bgSync task to jump into its finally block
    yield cancel(watchingTask);
  }
}

export function* authSaga() {
  yield fork(watchingAccountBalanceSaga);
  yield takeLatest(logoutAsync, logoutSaga);
  yield takeLatest(syncActivePetPointsAsync, syncActivePetPointsSaga);
}

import * as nftPetApi from "@/apis/nft-pet";
import { Pet } from "@/types/pet";
import { createAction } from "@reduxjs/toolkit";
import { call, delay, put, takeEvery } from "redux-saga/effects";
import { petSlice } from "./slice";

export const syncNewPetAsync = createAction<{ nftPublicKey: string }>(
  "pet/syncNewPetAsync"
);

function* syncNewPetSaga(action: ReturnType<typeof syncNewPetAsync>) {
  let found: Pet | undefined = undefined;
  while (!found) {
    try {
      const pets: Pet[] = yield call(nftPetApi.getMyPets);
      found = pets.find((p) => p.nftPublicKey === action.payload.nftPublicKey);
      if (found) {
        yield put(
          petSlice.actions.setPets({
            pets,
          })
        );
      }
    } catch (e) {
      console.log(e);
    }
    yield delay(2000);
  }
}

export function* petSaga() {
  yield takeEvery(syncNewPetAsync, syncNewPetSaga);
}

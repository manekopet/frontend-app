import { all } from "redux-saga/effects";
import { accountSaga } from "./features/account/saga";
import { authSaga } from "./features/auth/saga";
import { petSaga } from "./features/pet/saga";

export default function* rootSaga() {
  yield all([authSaga(), accountSaga(), petSaga()]);
  // yield all([]);
}

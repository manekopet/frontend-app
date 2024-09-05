// slices
import { combineReducers } from "redux";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import accountSlice from "./features/account/slice";
import appSlice from "./features/app/slice";
import authSlice from "./features/auth/slice";
import onboardingSlice from "./features/onboarding/slice";
import petSlice from "./features/pet/slice";

// ----------------------------------------------------------------------

export const createNoopStorage = () => ({
  getItem(_key: string) {
    return Promise.resolve(null);
  },
  setItem(_key: string, value: any) {
    return Promise.resolve(value);
  },
  removeItem(_key: string) {
    return Promise.resolve();
  },
});

export const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

export const ReduxPersistVersion = 107;

export const rootPersistConfig = {
  version: ReduxPersistVersion,
  key: "root",
  storage,
  keyPrefix: "redux-",
  stateReconciler: autoMergeLevel2,
  whitelist: [
    `${authSlice.name}-${ReduxPersistVersion}`,
    `${appSlice.name}-${ReduxPersistVersion}`,
    `${accountSlice.name}-${ReduxPersistVersion}`,
    // `${petSlice.name}-${ReduxPersistVersion}`,
    // `${onboardingSlice.name}-${ReduxPersistVersion}`,
  ],
};

const rootReducer = combineReducers({
  // app: appSlice.reducer,
  [`${authSlice.name}-${ReduxPersistVersion}`]: authSlice.reducer,
  [`${appSlice.name}-${ReduxPersistVersion}`]: appSlice.reducer,
  [`${accountSlice.name}-${ReduxPersistVersion}`]: accountSlice.reducer,
  [`${petSlice.name}-${ReduxPersistVersion}`]: petSlice.reducer,
  [`${onboardingSlice.name}-${ReduxPersistVersion}`]: onboardingSlice.reducer,
});

export default rootReducer;

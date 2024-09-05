import { Action, ThunkAction, configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from "redux-persist";
import createSagaMiddleware from "redux-saga";
import rootReducer, { rootPersistConfig } from "./root-reducer";
import rootSaga from "./root-saga";

const IS_DEV = true;

const sagaMiddleware = createSagaMiddleware();

const makeStore = () =>
  configureStore({
    devTools: IS_DEV,
    reducer: persistReducer<ReturnType<typeof rootReducer>>(
      rootPersistConfig,
      rootReducer
    ),
    middleware: (getDefaultMiddleware: any) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
        thunk: false,
      }).concat(sagaMiddleware),
    // .concat(logger),
  });

export const store = makeStore();

sagaMiddleware.run(rootSaga);

export const persistor = persistStore(store);

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action
>;

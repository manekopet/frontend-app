import React, { createContext, useReducer, Dispatch } from 'react';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { PersistGate } from 'redux-persist/integration/react';
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';

const initialState = {
  appState: '',
  email: '',
  aggregateVerifier: '',
  name: '',
  profileImage: '',
  typeOfLogin: '',
  verifier: '',
  verifierId: '',
  dappShare: '',
  oAuthIdToken: '',
  oAuthAccessToken: '',
  isMfaEnabled: false,
  idToken: '',
};

type ActionType = {
  type: string;
  payload: any;
};

export const AccountContext = createContext<{
  state: typeof initialState;
  dispatch: Dispatch<ActionType>;
}>({
  state: initialState,
  dispatch: () => undefined,
});

const accountReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'SET_ACCOUNT_DATA':
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

const persistConfig = {
  key: 'account',
  storage,
  //   stateReconciler: autoMergeLevel2,
};

const persistedReducer = persistReducer(persistConfig, accountReducer);

export const AccountProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(persistedReducer, initialState);
  const persistor = persistStore(state);
  return (
    <AccountContext.Provider value={{ state, dispatch }}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </AccountContext.Provider>
  );
};

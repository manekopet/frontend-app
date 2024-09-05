export const ONE_SECOND = 1000;

export const PRIVATE_KEY_B58 = "private_key_b58";

export enum ERROR_WALLET {
  UninitializedWalletAdapterError = "UninitializedWalletAdapterError",
  Method_Notfound = "method not found",
}

export const gateProvider = window?.gatewallet?.solana;

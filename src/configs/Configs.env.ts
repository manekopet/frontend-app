import { PublicKey } from "@solana/web3.js";
import isEmpty from "lodash/isEmpty";
// import Web3 from 'web3';

declare global {
  interface Window {
    token: string;
    // ethereum: any;
    // solana: any;
    coin98: any;
    gatewallet: {
      solana: {
        publicKey?: PublicKey;
        isConnected: boolean;
        signMessage: (message: any, type: string) => any;
        connect: () => any;
        getAccount: () => any;
        gateAccountInfo: () => any;
        onAccountChange: () => any;
        signAndSendTransaction: (transaction: any) => any;
        signTransaction: (transaction: any) => any;
        signAllTransactions: (transaction: any) => any;
        on: any;
        off: any;
      };
    };
    // web3: Web3;
  }
}

interface IENVS {
  REACT_APP_IS_MAINNET: boolean;
  REACT_APP_API_ENDPOINT: string;
  REACT_APP_WEB_ENDPOINT: string;
  REACT_APP_APP_ENDPOINT: string;
  REACT_APP_SOL_RPC: string;
  REACT_APP_MGEM_TOKEN: string;
  REACT_APP_MINT_CREATOR: string;
  REACT_APP_MINT_CANDY_MACHINE: string;
  REACT_APP_MINT_MASTER_PUBKEY: string;
  REACT_APP_WEB3_AUTH_CHAIN_ID: string;
  REACT_APP_WEB3_AUTH_CLIENT_ID: string;
  REACT_APP_WEB3_AUTH_NETWORK: string;
  REACT_APP_SWAP_POOL: string;
  REACT_APP_FEE_BASIS_POINTS: string;
  REACT_APP_MAX_FEE: string;
  REACT_APP_DECIMALS_FEE: string;
  REACT_APP_BYPASS_PWA: boolean;
  REACT_APP_SENTRY_DSN: string;
  REACT_APP_SENTRY_ENVIRONMENT: string;
  REACT_APP_GAME_URL: string;
  REACT_APP_MP_TOKEN: string;
}

const defaultEnvs = {
  REACT_APP_IS_MAINNET: false,
  REACT_APP_WEB_ENDPOINT: "https://dev.maneko-frontend.pages.dev",
  REACT_APP_APP_ENDPOINT: "https://dev.manekopet.xyz",
  REACT_APP_API_ENDPOINT: "https://dev-api.manekopet.xyz",
  REACT_APP_SOL_RPC:
    "https://cool-greatest-needle.solana-devnet.quiknode.pro/56d900682d4a6267aaec5c705a4890ac13e0318e/",
  REACT_APP_MGEM_TOKEN: "HB1mPuKv8k67F6Bg9UKFjRymeXTzcMbJfxQT9N7DkTzE",
  REACT_APP_MP_TOKEN: "",
  REACT_APP_MINT_CREATOR: "tjWzLMrKqgN9gx45rdyUhXKqG9Ls6mYbGp2hLP63Xv1",
  REACT_APP_MINT_CANDY_MACHINE: "EaGNPBvTCHaaG64AKQNQJ4bUzGpEYYt2PfQRMDevRBBt",
  REACT_APP_WEB3_AUTH_CHAIN_ID: "0x3",
  REACT_APP_WEB3_AUTH_NETWORK: "sapphire_devnet",
  REACT_APP_WEB3_AUTH_CLIENT_ID:
    "BPJzONxVuQ-NW8zuYY5K_VCH2CUz0GKVfw-2e4qLKlDvLSd1y_rF5g6RA4VxrXviIqGfia91gLQgPmEWZVsdUho",
  REACT_APP_SWAP_POOL: "2ixC72ez4ash2JFxQFHDK1ioeusKt1TJ2Ktx9odD5yaP",
  REACT_APP_MINT_MASTER_PUBKEY: "tjWzLMrKqgN9gx45rdyUhXKqG9Ls6mYbGp2hLP63Xv1",
  REACT_APP_FEE_BASIS_POINTS: "500",
  REACT_APP_MAX_FEE: "100000",
  REACT_APP_DECIMALS_FEE: "9",
  REACT_APP_BYPASS_PWA: false,
  REACT_APP_SENTRY_DSN:
    "https://f5eec4286570538b633acc0ffd913bf6@o4506779597930496.ingest.sentry.io/4506779599241216",
  REACT_APP_GAME_URL: "https://html-classic.itch.zone/html/9800048/index.html",
};

export const getEnvs = () => {
  let envs: any = {};
  try {
    const PROCCESS_ENV = process.env;
    if (!isEmpty(PROCCESS_ENV)) {
      Object.keys(PROCCESS_ENV).forEach((key: string) => {
        const value = PROCCESS_ENV[key];
        if (value === "true" || value === "false") {
          envs[key] = value === "true";
        } else {
          envs[key] = PROCCESS_ENV[key];
        }
        return key;
      });
    }
  } catch (error) {
    console.debug(error);
  } finally {
    envs = isEmpty(envs) ? defaultEnvs : envs;
  }
  return { ...envs, REACT_APP_DOMAIN_URL: window.location.origin };
};

export const ENVS: IENVS = getEnvs();

export const isMainnet: boolean = ENVS.REACT_APP_IS_MAINNET;
// export const appDomain: string = ENVS.REACT_APP_DOMAIN_URL;

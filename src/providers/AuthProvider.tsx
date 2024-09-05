import * as authApi from "@/apis/auth";
import { ENVS } from "@/configs/Configs.env";
import { useSelector } from "@/hooks/redux";
import useAccounts from "@/hooks/useAccounts";
import { logoutAsync } from "@/redux/features/auth/saga";
import { authSelector } from "@/redux/features/auth/selectors";
import authSlice from "@/redux/features/auth/slice";
import { PRIVATE_KEY_B58 } from "@/utils/constants";
import { getSignature } from "@/utils/solana";
import SolanaRpc from "@/utils/solanaRPC";
import { mplCandyMachine } from "@metaplex-foundation/mpl-candy-machine";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  PhantomWalletName,
  SolflareWalletName,
} from "@solana/wallet-adapter-wallets";
import { PublicKey } from "@solana/web3.js";
import {
  ADAPTER_EVENTS,
  CHAIN_NAMESPACES,
  CONNECTED_EVENT_DATA,
  IProvider,
  OPENLOGIN_NETWORK_TYPE,
  UserInfo,
  WALLET_ADAPTERS,
} from "@web3auth/base";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { PhantomAdapter } from "@web3auth/phantom-adapter";
import {
  SolanaPrivateKeyProvider,
  SolanaWallet,
} from "@web3auth/solana-provider";
import { SolflareAdapter } from "@web3auth/solflare-adapter";
import base58 from "bs58";
import React, { ReactNode, useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export const umi = createUmi(ENVS.REACT_APP_SOL_RPC, {
  commitment: "confirmed",
}).use(mplCandyMachine());

const WEB3AUTH_CLIENT_ID = ENVS.REACT_APP_WEB3_AUTH_CLIENT_ID;
// const WEB3AUTH_CLIENT_ID =
//   "BEglQSgt4cUWcj6SKRdu5QkOXTsePmMcusG5EAoyjyOYKlVRjIF1iCNnMOTfpzCiunHRrMui8TIwQPXdkQ8Yxuk";

export enum SocialLogin {
  GOOGLE = "google",
  TWITTER = "twitter",
  APPLE = "apple",
}
export enum WalletLogin {
  PHANTOM = "phantom",
  SOLFLARE = "solflare",
  BITGET = "Bitget",
}
export interface AuthProviderData {
  web3auth: Web3AuthNoModal | null;
  provider: IProvider | null;
  user: Partial<UserInfo> | null;
  // onSuccessfulLogin: (data: CONNECTED_EVENT_DATA, user: any) => void;
  login: (props: { tSocial?: SocialLogin; tWallet?: WalletLogin }) => void;
  logout: () => void;
  address: string;
  isSocialLogin: boolean;
  isLogined: boolean;
  isGate: boolean;
  loading: {
    google: boolean;
    twitter: boolean;
    apple: boolean;
    solflare: boolean;
    phantom: boolean;
    bitget: boolean;
  };
}

export const AuthContext = React.createContext<AuthProviderData>({
  web3auth: null,
  provider: null,
  user: null,
  // onSuccessfulLogin: (data: any) => {},
  login: () => {},
  logout: () => {},
  address: "",
  isSocialLogin: false,
  isLogined: false,
  isGate: false,
  loading: {
    google: false,
    twitter: false,
    apple: false,
    solflare: false,
    phantom: false,
    bitget: false,
  },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [user, setUser] = useState<Partial<UserInfo> | null>(null);
  const [web3auth, setWeb3auth] = useState<Web3AuthNoModal | null>(null);
  const [isGate, setIsGate] = useState(!!localStorage.getItem("GATE_CONNECT"));
  const [loading, setLoading] = useState({
    google: false,
    twitter: false,
    apple: false,
    solflare: false,
    phantom: false,
    bitget: false,
  });
  const dispatch = useDispatch();
  // const [address, setAddress] = useState<string>("");
  const { address = "" } = useAccounts();
  const wallet = useWallet();
  const authState = useSelector(authSelector.selectorDomain);

  const chainConfig = {
    chainNamespace: CHAIN_NAMESPACES.SOLANA,
    chainId: ENVS.REACT_APP_WEB3_AUTH_CHAIN_ID, // Please use 0x1 for Mainnet, 0x2 for Testnet, 0x3 for Devnet
    // rpcTarget: "https://api.devnet.solana.com",
    displayName: ENVS.REACT_APP_WEB3_AUTH_NETWORK,
    blockExplorer: "https://explorer.solana.com",
    ticker: "SOL",
    tickerName: "Solana Token",
    // chainId: "0x1", // Please use 0x1 for Mainnet, 0x2 for Testnet, 0x3 for Devnet
    rpcTarget: ENVS.REACT_APP_SOL_RPC, // This is the public RPC we have added, please pass on your own endpoint while creating an app
  };
  // createUmi(rpcURL).use(mplCandyMachine()).use(walletAdapterIdentity(wallet));

  const onSuccessfulLogin = async (
    data: CONNECTED_EVENT_DATA,
    user: Partial<UserInfo>
  ) => {
    if (data.adapter === "openlogin") {
      if (web3auth) {
        const provider2 = web3auth.provider;
        if (provider2) {
          const solanaWallet = new SolanaWallet(provider2);
          const address2 = await solanaWallet.requestAccounts();
          const infoUser = await web3auth.getUserInfo();
          const result = await authApi.requestNonce(address2[0]);
          const { nonce, publicAddress, signed } = result as any;
          const signature: string = await getSignature(
            publicAddress,
            nonce,
            provider2
          );
          const { token } = await authApi.login(
            publicAddress,
            signature,
            nonce,
            infoUser || {}
          );
          setUser(infoUser);
          if (token) {
            window.token = token;
            const profile: any = await authApi.getProfile();
            dispatch(
              authSlice.actions.loginSuccess({
                accessToken: token,
                user: profile?.user,
                signed: signed,
                balance: profile?.balance,
              })
            );
          } else {
            // TODO display error
          }
        }
      }
    } else {
      setUser(user);
      try {
        if (wallet.connected) {
          await wallet.connect();
        }
      } catch (error) {
        console.log("🚀 ~ AuthProvider ~ error:", error);
      }
    }
    // setAddress(address);
  };

  useEffect(() => {
    const init = async () => {
      try {
        const web3authClient = new Web3AuthNoModal({
          clientId: WEB3AUTH_CLIENT_ID,
          chainConfig: chainConfig,
          sessionTime: 24 * 3600,
          // uiConfig refers to the whitelabeling options, which is available only on Growth Plan and above
          // Please remove this parameter if you're on the Base Plan
          // uiConfig: {
          //   appName: "Maneko Game",
          //   mode: "dark",
          //   loginMethodsOrder: ["google", "apple", "twitter"],
          //   logoLight: "https://web3auth.io/images/web3auth-logo.svg",
          //   logoDark: "https://web3auth.io/images/web3auth-logo---Dark.svg",
          //   defaultLanguage: "en", // en, de, ja, ko, zh, es, fr, pt, nl
          //   loginGridCol: 3,
          //   primaryButton: "externalLogin", // "externalLogin" | "socialLogin" | "emailLogin"
          // },
          web3AuthNetwork:
            ENVS.REACT_APP_WEB3_AUTH_NETWORK as OPENLOGIN_NETWORK_TYPE,
        });
        const privateKeyProvider = new SolanaPrivateKeyProvider({
          config: { chainConfig },
        });
        const openloginAdapter = new OpenloginAdapter({
          privateKeyProvider,
          // loginSettings: {
          //   mfaLevel: "none",
          // },
          adapterSettings: {
            uxMode: "redirect", // "redirect" | "popup"
            // whiteLabel: {
            //   appName: "Maneko Game",
            //   logoLight: "https://web3auth.io/images/web3auth-logo.svg",
            //   logoDark: "https://web3auth.io/images/web3auth-logo---Dark.svg",
            //   defaultLanguage: "en", // en, de, ja, ko, zh, es, fr, pt, nl
            // },
            // mfaSettings: {
            //   deviceShareFactor: {
            //     enable: true,
            //     priority: 1,
            //     mandatory: true,
            //   },
            //   backUpShareFactor: {
            //     enable: true,
            //     priority: 2,
            //     mandatory: false,
            //   },
            //   socialBackupFactor: {
            //     enable: true,
            //     priority: 3,
            //     mandatory: false,
            //   },
            //   passwordFactor: {
            //     enable: true,
            //     priority: 4,
            //     mandatory: false,
            //   },
            // },
          },
        });

        web3authClient.configureAdapter(openloginAdapter);

        const solflareAdapter = new SolflareAdapter({
          clientId: WEB3AUTH_CLIENT_ID,
        });
        web3authClient.configureAdapter(solflareAdapter);

        const phantomAdapter = new PhantomAdapter({
          clientId: WEB3AUTH_CLIENT_ID,
        });
        web3authClient.configureAdapter(phantomAdapter);

        // const bitgetAdaper = new BitgetWalletAdapter({});
        // web3authClient.configureAdapter(bitgetAdaper);

        setWeb3auth(web3authClient);
        // wallet.select(PhantomAdapter);
        // await web3authClient.initModal();
        await web3authClient.init();
        setProvider(web3authClient.provider);
      } catch (error) {
        console.log("🚀 ~ file: AuthProvider.tsx:84 ~ init ~ error:", error);
        dispatch(logoutAsync());
      }
    };

    init();
  }, []);

  const connectWalletExtention = async () => {
    if (!wallet.publicKey || !wallet.signMessage) return;
    const addressPubkey = wallet.publicKey.toString();
    const result = await authApi.requestNonce(addressPubkey);
    const { nonce, publicAddress, signed } = result as any;
    const msg = new TextEncoder().encode(`${nonce}`);
    const res = await wallet.signMessage(msg);
    const bytes = Uint8Array.from(res);
    const messageSignedBase58 = base58.encode(bytes);
    const { token } = await authApi.login(
      publicAddress,
      messageSignedBase58,
      nonce,
      {}
    );
    setUser({});
    if (token) {
      window.token = token;
      const profile: any = await authApi.getProfile();
      dispatch(
        authSlice.actions.loginSuccess({
          accessToken: token,
          user: profile?.user,
          signed: signed,
          balance: profile?.balance,
        })
      );
    } else {
      // TODO display error
    }
  };

  const connectGateWallet = async (addressPubkey: string) => {
    const gateProvider = window?.gatewallet?.solana;
    if (!gateProvider || !gateProvider.isConnected) return;
    // const addressPubkey = wallet.publicKey.toString();
    const result = await authApi.requestNonce(addressPubkey);
    const { nonce, publicAddress, signed } = result as any;
    const msg = new TextEncoder().encode(`${nonce}`);
    console.log("🚀 ~ connectGateWal ~ msg:", msg);
    gateProvider.signMessage(msg, "utf8").then(async ({ signature }: any) => {
      console.log("🚀 ~ connectGateWal ~ signature:", signature);

      const bytes = Uint8Array.from(signature);
      const messageSignedBase58 = base58.encode(bytes);
      const { token } = await authApi.login(
        publicAddress,
        messageSignedBase58,
        nonce,
        {}
      );
      setUser({});
      if (token) {
        window.token = token;
        const profile: any = await authApi.getProfile();
        localStorage.setItem("GATE_CONNECT", "true");
        setIsGate(true);
        dispatch(
          authSlice.actions.loginSuccess({
            accessToken: token,
            user: profile?.user,
            signed: signed,
            balance: profile?.balance,
          })
        );
      } else {
        // TODO display error
      }
    });
  };

  useEffect(() => {
    if (!web3auth?.connected && wallet?.publicKey && !authState.accessToken) {
      connectWalletExtention();
    }
  }, [web3auth?.connected, wallet?.publicKey, authState.accessToken]);

  useEffect(() => {
    const gateProvider = window?.gatewallet?.solana;

    if (gateProvider) {
      gateProvider.on("connect", (publicKey: PublicKey) => {
        connectGateWallet(publicKey.toString());
      });
    }

    return () => {
      gateProvider?.off("connect");
    };
  }, [window?.gatewallet?.solana]);

  const login = async ({
    tSocial,
    tWallet,
    isGate,
  }: {
    tSocial?: SocialLogin;
    tWallet?: WalletLogin;
    isGate?: boolean;
  }) => {
    try {
      if (!tSocial && !tWallet) return;
      if (!web3auth) return;
      let providerWeb3: any = null;
      if (tSocial) {
        await web3auth.init();
      }
      if (!web3auth.connected) {
        if (tSocial) {
          setLoading({
            google: tSocial === SocialLogin.GOOGLE,
            twitter: tSocial === SocialLogin.TWITTER,
            apple: tSocial === SocialLogin.APPLE,
            solflare: false,
            phantom: false,
            bitget: false,
          });
          providerWeb3 = await web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
            loginProvider: tSocial, // facebook, apple,
          });
        } else {
          setLoading({
            google: false,
            twitter: false,
            apple: false,
            solflare: tWallet === WalletLogin.SOLFLARE,
            phantom: tWallet === WalletLogin.PHANTOM,
            bitget: tWallet === WalletLogin.BITGET,
          });
          // wallet.select(tWallet as any);
          await wallet.connect();

          // providerWeb3 = await web3auth.connectTo(
          //   tWallet === WalletLogin.SOLFLARE
          //     ? WALLET_ADAPTERS.SOLFLARE
          //     : WALLET_ADAPTERS.PHANTOM
          // );
        }
      } else {
        providerWeb3 = web3auth.provider;
      }

      if (tWallet) {
        console.log("🚀 ~ AuthProvider ~ wallet.publicKey:", wallet.publicKey);
        return;
      }

      if (providerWeb3) {
        setProvider(providerWeb3);
        const solanaWallet = new SolanaWallet(providerWeb3);
        const address2 = await solanaWallet.requestAccounts();
        const infoUser = await web3auth.getUserInfo();
        const result = await authApi.requestNonce(address2[0]);
        const { nonce, publicAddress, signed } = result as any;
        const signature: string = await getSignature(
          publicAddress,
          nonce,
          providerWeb3
        );
        const { token } = await authApi.login(
          publicAddress,
          signature,
          nonce,
          infoUser || {}
        );
        setUser(infoUser);
        if (token) {
          window.token = token;
          const profile: any = await authApi.getProfile();
          dispatch(
            authSlice.actions.loginSuccess({
              accessToken: token,
              user: profile?.user,
              signed: signed,
              balance: profile?.balance,
            })
          );
        } else {
          // TODO display error
        }
        // if (Object.keys(user).length === 0) {
        //   await wallet.connect();
        // }
      }
    } catch (error) {
      console.log("🚀 ~ file: AuthProvider.tsx:102 ~ login ~ error:", error);
      // throw error;
    } finally {
      setLoading({
        google: false,
        twitter: false,
        apple: false,
        solflare: false,
        phantom: false,
        bitget: false,
      });
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem("GATE_CONNECT");
    try {
      wallet.disconnect();
      localStorage.removeItem(PRIVATE_KEY_B58);
      if (web3auth) {
        web3auth
          .logout()
          .then(() => {
            // login on logout
            dispatch(logoutAsync());
          })
          .catch((err: any) => {
            console.log("logout", err);
            dispatch(logoutAsync());
          });
      }
    } catch (error) {}
  }, [dispatch, wallet, web3auth]);

  const subscribeAuthEvents = (web3auth: Web3AuthNoModal) => {
    web3auth.on(
      ADAPTER_EVENTS.CONNECTED,
      async (data: CONNECTED_EVENT_DATA) => {
        if (data.adapter === "solflare") {
          // wallet.select(SolflareWalletName);
          if (!wallet.connected) {
            // await wallet.connect();
          }
          console.log("🚀 ~ SolflareWalletName:", SolflareWalletName);
        }
        if (data.adapter === "phantom") {
          wallet.select(PhantomWalletName);
          console.log("🚀 ~ PhantomWalletName:", PhantomWalletName);
        }
        console.log("Yeah!, you are successfully logged in", data);
        try {
          const user = await web3auth.getUserInfo();
          // .then((user: Partial<OpenloginUserInfo>) => {
          onSuccessfulLogin(data, user);
          // });
        } catch (error) {
          console.log(
            "🚀 ~ file: AuthProvider.tsx:128 ~ web3auth.on ~ error:",
            error
          );
        }
      }
    );

    web3auth.on(ADAPTER_EVENTS.CONNECTING, () => {
      console.log("connecting");
    });
    web3auth.on(ADAPTER_EVENTS.CONNECTED, () => {
      console.log("connected");
      // subscribeAuthEvents(web3auth);
    });

    web3auth.on(ADAPTER_EVENTS.DISCONNECTED, () => {
      console.log("disconnected");
      setUser(null);
      setProvider(null);
      dispatch(logoutAsync());
    });

    // web3auth.on(ADAPTER_EVENTS.ERRORED, (error: any) => {
    //   console.log('some error or user have cancelled login request', error);
    // });

    // web3auth.on(LOGIN_MODAL_EVENTS.MODAL_VISIBILITY, (isVisible: any) => {
    //   console.log('modal visibility', isVisible);
    // });
  };

  useEffect(() => {
    if (!web3auth) return;
    subscribeAuthEvents(web3auth);

    // web3auth.init().catch((err: string) => {
    //   // wallet.connect();
    //   console.log("web3auth.initModal error" + err);
    // });
  }, [web3auth]);

  // useEffect(() => {
  //   wallet.select(PhantomWalletName);
  // }, []);

  useEffect(() => {
    (async () => {
      try {
        if (provider && address) {
          const solana = new SolanaRpc(provider);
          const privateKey = await solana.getPrivateKey();
          if (privateKey) {
            localStorage.setItem(PRIVATE_KEY_B58, privateKey);
          }
        }
        //  else {
        //   localStorage.removeItem(PRIVATE_KEY_B58);
        // }
      } catch (error) {
        console.log("🚀 ~ error:", error);
      }
    })();
  }, [provider, address]);
  const ctx: AuthProviderData = {
    web3auth,
    provider,
    user,
    login,
    logout,
    address,
    isGate,
    loading,
    isLogined: web3auth?.connected || wallet.connected,
    isSocialLogin: user ? Object.keys(user).length !== 0 : false,
  };
  return <AuthContext.Provider value={ctx}>{children}</AuthContext.Provider>;
};

// export const AuthConsumer = AuthContext.Consumer;

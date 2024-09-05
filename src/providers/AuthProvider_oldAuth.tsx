import { ENVS } from "@/configs/Configs.env";
import useAccounts from "@/hooks/useAccounts";
import { logoutAsync } from "@/redux/features/auth/saga";
import { mplCandyMachine } from "@metaplex-foundation/mpl-candy-machine";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  PhantomWalletName,
  SolflareWalletName,
} from "@solana/wallet-adapter-wallets";
import {
  ADAPTER_EVENTS,
  CHAIN_NAMESPACES,
  CONNECTED_EVENT_DATA,
  UserInfo,
} from "@web3auth/base";
import { Web3Auth } from "@web3auth/modal";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { PhantomAdapter } from "@web3auth/phantom-adapter";
import { SolflareAdapter } from "@web3auth/solflare-adapter";
import React, { ReactNode, useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export const umi = createUmi(ENVS.REACT_APP_SOL_RPC).use(mplCandyMachine());

const WEB3AUTH_CLIENT_ID = ENVS.REACT_APP_WEB3_AUTH_CLIENT_ID;
// const WEB3AUTH_CLIENT_ID =
//   "BEglQSgt4cUWcj6SKRdu5QkOXTsePmMcusG5EAoyjyOYKlVRjIF1iCNnMOTfpzCiunHRrMui8TIwQPXdkQ8Yxuk";

export interface AuthProviderData {
  web3auth: Web3Auth | null;
  provider: CONNECTED_EVENT_DATA | null;
  user: Partial<UserInfo> | null;
  onSuccessfulLogin: (data: CONNECTED_EVENT_DATA, user: any) => void;
  login: () => void;
  logout: () => void;
  address: string;
  isSocialLogin: boolean;
  loading: boolean;
}

export const AuthContext = React.createContext<AuthProviderData>({
  web3auth: null,
  provider: null,
  user: null,
  onSuccessfulLogin: (data: any) => {},
  login: () => {},
  logout: () => {},
  address: "",
  isSocialLogin: false,
  loading: false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [provider, setProvider] = useState<CONNECTED_EVENT_DATA | null>(null);
  const [user, setUser] = useState<Partial<UserInfo> | null>(null);
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  // const [address, setAddress] = useState<string>("");
  const { address = "" } = useAccounts();
  const wallet = useWallet();

  // createUmi(rpcURL).use(mplCandyMachine()).use(walletAdapterIdentity(wallet));

  const onSuccessfulLogin = (
    data: CONNECTED_EVENT_DATA,
    user: Partial<UserInfo>
  ) => {
    console.log("🚀 ~ onSuccessfulLogin ~ data:", data);
    setProvider(data);
    setUser(user);
    // setAddress(address);
  };

  useEffect(() => {
    const init = async () => {
      try {
        const web3authClient = new Web3Auth({
          clientId: WEB3AUTH_CLIENT_ID,
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.SOLANA,
            chainId: "0x1", // Please use 0x1 for Mainnet, 0x2 for Testnet, 0x3 for Devnet
            rpcTarget: ENVS.REACT_APP_SOL_RPC, // This is the public RPC we have added, please pass on your own endpoint while creating an app
          },
          // uiConfig refers to the whitelabeling options, which is available only on Growth Plan and above
          // Please remove this parameter if you're on the Base Plan
          uiConfig: {
            appName: "Maneko Game",
            mode: "dark",
            loginMethodsOrder: ["google", "apple", "twitter"],
            logoLight: "https://web3auth.io/images/web3auth-logo.svg",
            logoDark: "https://web3auth.io/images/web3auth-logo---Dark.svg",
            defaultLanguage: "en", // en, de, ja, ko, zh, es, fr, pt, nl
            loginGridCol: 3,
            primaryButton: "externalLogin", // "externalLogin" | "socialLogin" | "emailLogin"
          },
          web3AuthNetwork: "sapphire_devnet",
        });

        const openloginAdapter = new OpenloginAdapter({
          loginSettings: {
            mfaLevel: "optional",
          },
          adapterSettings: {
            uxMode: "redirect", // "redirect" | "popup"
            whiteLabel: {
              appName: "Maneko Game",
              logoLight: "https://web3auth.io/images/web3auth-logo.svg",
              logoDark: "https://web3auth.io/images/web3auth-logo---Dark.svg",
              defaultLanguage: "en", // en, de, ja, ko, zh, es, fr, pt, nl
            },
            mfaSettings: {
              deviceShareFactor: {
                enable: true,
                priority: 1,
                mandatory: true,
              },
              backUpShareFactor: {
                enable: true,
                priority: 2,
                mandatory: false,
              },
              socialBackupFactor: {
                enable: true,
                priority: 3,
                mandatory: false,
              },
              passwordFactor: {
                enable: true,
                priority: 4,
                mandatory: false,
              },
            },
          },
        });
        web3authClient.configureAdapter(openloginAdapter);

        const solflareAdapter = new SolflareAdapter({
          clientId: WEB3AUTH_CLIENT_ID,
        });
        web3authClient.configureAdapter(solflareAdapter);

        const slopeAdapter = new PhantomAdapter({
          clientId: WEB3AUTH_CLIENT_ID,
        });
        web3authClient.configureAdapter(slopeAdapter);

        setWeb3auth(web3authClient);

        await web3authClient.initModal();
      } catch (error) {
        console.log("🚀 ~ file: AuthProvider.tsx:84 ~ init ~ error:", error);
      }
    };

    init();
  }, []);

  const login = useCallback(async () => {
    try {
      if (!web3auth) return;
      setLoading(true);
      await web3auth.connect();
      // console.log('🚀 ~ login ~ data:', data);

      if (web3auth.connected) {
        const user = await web3auth.getUserInfo();
        console.log("🚀 ~ login ~ user:", user);
        setUser(user);
        if (Object.keys(user).length === 0) {
          await wallet.connect();
        }
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("🚀 ~ file: AuthProvider.tsx:102 ~ login ~ error:", error);
    }
  }, [web3auth]);

  const logout = useCallback(() => {
    if (!web3auth) return;
    web3auth
      .logout()
      .then(() => {
        // login on logout
        dispatch(logoutAsync());
      })
      .catch((err: any) => {
        console.log("logout", err);
      });
  }, []);

  const subscribeAuthEvents = (web3auth: Web3Auth) => {
    web3auth.on(
      ADAPTER_EVENTS.CONNECTED,
      async (data: CONNECTED_EVENT_DATA) => {
        if (data.adapter === "solflare") {
          wallet.select(SolflareWalletName);
        }
        if (data.adapter === "phantom") {
          wallet.select(PhantomWalletName);
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

    web3auth.initModal().catch((err: string) => {
      // wallet.connect();
      console.log("web3auth.initModal error" + err);
    });
  }, [web3auth]);

  const ctx: AuthProviderData = {
    web3auth,
    provider,
    user,
    onSuccessfulLogin,
    login,
    logout,
    address,
    loading,
    isSocialLogin: user ? Object.keys(user).length !== 0 : false,
  };
  return <AuthContext.Provider value={ctx}>{children}</AuthContext.Provider>;
};

// export const AuthConsumer = AuthContext.Consumer;

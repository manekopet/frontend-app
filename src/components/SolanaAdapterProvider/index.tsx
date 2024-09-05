import { WalletAdapterNetwork, WalletError } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  BitgetWalletAdapter,
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { useCallback, useMemo } from "react";

function SolanaAdapterProvider({ children }: { children: any }) {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new BitgetWalletAdapter(),
    ],
    [network]
  );

  const onError = useCallback((error: WalletError) => {
    console.log("🚀 ~ Solana Adapter ~ error:", error);
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} onError={onError} autoConnect>
        {/* autoConnect */}
        {children}
        {/* <WalletModalProvider className="model-solana-custom"></WalletModalProvider> */}
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default SolanaAdapterProvider;

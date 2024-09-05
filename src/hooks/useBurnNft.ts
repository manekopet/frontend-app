import { AuthContext, umi } from "@/providers/AuthProvider";
import SolanaRpc from "@/utils/solanaRPC";
import { cmPubKey, tokenMetadataProgramId } from "@/utils/umiOnchain";
import { fetchCandyMachine } from "@metaplex-foundation/mpl-candy-machine";
import { TokenStandard, burnV1 } from "@metaplex-foundation/mpl-token-metadata";
import { keypairIdentity, publicKey } from "@metaplex-foundation/umi";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import {
  publicKey as publicKeySerializer,
  string,
} from "@metaplex-foundation/umi/serializers";
import { useWallet } from "@solana/wallet-adapter-react";
import { useCallback, useContext, useState } from "react";
import { toast } from "react-toastify";

function useBurnNft() {
  const { provider, isSocialLogin } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const wallet = useWallet();

  const onBurn = useCallback(
    async (tokenBurn: string) => {
      try {
        if (isSocialLogin) {
          if (!provider) return;
          setLoading(true);

          const rpc = new SolanaRpc(provider);
          const privateKey = await rpc.getPrivateKey();
          const keypair = umi.eddsa.createKeypairFromSecretKey(
            Buffer.from(privateKey as string, "hex")
          );
          umi.use(keypairIdentity(keypair));
        } else {
          umi.use(walletAdapterIdentity(wallet as any));
        }
        const candyMachineAccount = await fetchCandyMachine(umi, cmPubKey);
        const metadata = umi.eddsa.findPda(tokenMetadataProgramId, [
          string({ size: "variable" }).serialize("metadata"),
          publicKeySerializer().serialize(tokenMetadataProgramId),
          publicKeySerializer().serialize(candyMachineAccount.collectionMint),
        ]);
        const nftMint = publicKey(tokenBurn);
        await burnV1(umi, {
          mint: nftMint,
          collectionMetadata: metadata[0],
          authority: umi.identity,
          tokenOwner: umi.identity.publicKey,
          tokenStandard: TokenStandard.NonFungible,
        }).sendAndConfirm(umi);

        toast.success("Burn NFT Successfully");
      } catch (error: any) {
        toast.error(error?.message);
      } finally {
        setLoading(false);
      }
    },
    [isSocialLogin, wallet, provider]
  );
  return {
    loading,
    onBurn,
  };
}
export default useBurnNft;

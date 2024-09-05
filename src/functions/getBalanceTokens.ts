import { ENVS } from "@/configs/Configs.env";
import { Connection, PublicKey, TokenAmount } from "@solana/web3.js";

export const fetchBalances = async ({ owner }: { owner: string }) => {
  const connection = new Connection(ENVS.REACT_APP_SOL_RPC);

  const ownerAddress = owner;
  const ownerPublicKey = new PublicKey(ownerAddress);

  const balances: Record<string, TokenAmount> = {};
  const tokenPublicKey = new PublicKey(ENVS.REACT_APP_MGEM_TOKEN);
  const balance = await connection.getParsedTokenAccountsByOwner(
    ownerPublicKey,
    {
      mint: tokenPublicKey,
    }
  );
  balance.value.forEach(({ account }) => {
    if (
      account.data.parsed.info.mint.toLowerCase() ===
      ENVS.REACT_APP_MGEM_TOKEN.toLowerCase()
    ) {
      balances[ENVS.REACT_APP_MGEM_TOKEN] =
        account.data.parsed.info.tokenAmount;
    }
  });
  // Fetch all token balances
  // const balances = await connection.getParsedTokenAccountsByOwner(ownerPublicKey, {
  //   programId: TOKEN_PROGRAM_ID,
  // });

  return { balances };
};

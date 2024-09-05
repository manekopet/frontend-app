import { configSwap } from "@/configs/swap.config";
import { CONNECTION } from "@/functions";
import {
  AmmConfigLayout,
  ApiClmmConfigItem,
  ApiClmmPoolsItem,
  ApiClmmPoolsItemStatistics,
  Clmm,
  ClmmPoolInfo,
  Currency,
  CurrencyAmount,
  InnerSimpleV0Transaction,
  LOOKUP_TABLE_CACHE,
  Percent,
  PoolInfoLayout,
  SPL_ACCOUNT_LAYOUT,
  Token,
  TokenAccount,
  TokenAmount,
  TradeV2,
  TxVersion,
  buildSimpleTransaction,
  fetchMultipleMintInfos,
} from "@raydium-io/raydium-sdk";
import { TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import {
  AccountInfo,
  PublicKey,
  Transaction,
  VersionedTransaction,
} from "@solana/web3.js";
import Decimal from "decimal.js";
import { base58ToKeypair } from "./base58";
import { PRIVATE_KEY_B58 } from "./constants";

// var fs = require("fs");
// const connection = CONNECTION;

// Devnet
const targetPool = configSwap.targetPool;
const mpToken = new Token(
  TOKEN_2022_PROGRAM_ID,
  new PublicKey(configSwap.mpToken),
  9,
  "MP",
  "MP"
);

// const wsol = new Token(
//   TOKEN_PROGRAM_ID,
//   new PublicKey(configSwap.wsol),
//   9,
//   "WSOL",
//   "WSOL"
// );
const sol = new Currency(9, "SOL", "SOL");
// const wsol = Token.WSOL;
const makeTxVersion = TxVersion.V0;
const addLookupTableInfo = undefined;
const programIds = configSwap.programIds;

export async function swapTokens({
  owner,
  inputNumber,
  isDirectionRevert = false,
}: {
  owner: string; // address
  inputNumber: number;
  isDirectionRevert?: boolean;
}) {
  const outputToken = isDirectionRevert ? sol : mpToken;
  const inputTokenAmount = isDirectionRevert
    ? new TokenAmount(mpToken, inputNumber * 10 ** mpToken.decimals, true)
    : new CurrencyAmount(sol, inputNumber * 1e9, true);
  const slippage = new Percent(5, 100); // 1%
  const accountPubkey = new PublicKey(owner);
  const walletTokenAccounts = await getWalletTokenAccount(accountPubkey);

  const clmmPools: ApiClmmPoolsItem[] = [await formatClmmKeysById(targetPool)];
  const { [targetPool]: clmmPoolInfo } = await Clmm.fetchMultiplePoolInfos({
    connection: CONNECTION,
    poolKeys: clmmPools,
    chainTime: new Date().getTime() / 1000,
  });

  const tickCache = await Clmm.fetchMultiplePoolTickArrays({
    connection: CONNECTION,
    poolKeys: [clmmPoolInfo.state],
    batchRequest: true,
  });

  const { minAmountOut, remainingAccounts } = Clmm.computeAmountOutFormat({
    poolInfo: clmmPoolInfo.state,
    tickArrayCache: tickCache[targetPool],
    amountIn: inputTokenAmount,
    currencyOut: outputToken,
    slippage: slippage,
    epochInfo: await CONNECTION.getEpochInfo(),
    token2022Infos: await fetchMultipleMintInfos({
      connection: CONNECTION,
      mints: [
        ...clmmPools
          .map((i) => [
            { mint: i.mintA, program: i.mintProgramIdA },
            { mint: i.mintB, program: i.mintProgramIdB },
          ])
          .flat()
          .filter((i) => i.program === TOKEN_2022_PROGRAM_ID.toString())
          .map((i) => new PublicKey(i.mint)),
      ],
    }),
    catchLiquidityInsufficient: false,
  });

  // const estAmount = +minAmountOut.amount.raw.toString() / 1e9;
  // if (estAmount > 200) {
  //   return;
  // }
  // De show estimate amount out: minAmountOut.amount.raw.toString() / 1e9

  // const { innerTransactions } = await Clmm.makeSwapBaseInInstructionSimple({
  //   connection: CONNECTION,
  //   poolInfo: clmmPoolInfo.state,
  //   ownerInfo: {
  //     feePayer: accountPubkey,
  //     wallet: accountPubkey,
  //     tokenAccounts: walletTokenAccounts,
  //     useSOLBalance: true,
  //   },
  //   inputMint: inputTokenAmount.token.mint,
  //   amountIn: inputTokenAmount.raw,
  //   amountOutMin: minAmountOut.amount.raw,
  //   computeBudgetConfig: {
  //     units: 600000,
  //     microLamports: 25000,
  //   },
  //   remainingAccounts,
  //   makeTxVersion,
  // });
  const { innerTransactions } = await TradeV2.makeSwapInstructionSimple({
    connection: CONNECTION,
    swapInfo: {
      amountIn: {
        amount: inputTokenAmount,
        fee: undefined,
        expirationTime: undefined,
      },
      amountOut: {
        amount: minAmountOut.amount,
        fee: undefined,
        expirationTime: undefined,
      },
      minAmountOut: {
        amount: minAmountOut.amount,
        fee: undefined,
        expirationTime: undefined,
      },
      currentPrice: undefined,
      executionPrice: null,
      priceImpact: slippage,
      fee: [],
      routeType: "amm",
      poolKey: [clmmPoolInfo.state],
      remainingAccounts: [remainingAccounts],
      poolReady: true,
      poolType: "CLMM",
      expirationTime: undefined,
      allTrade: true,
    },
    ownerInfo: {
      wallet: accountPubkey,
      tokenAccounts: walletTokenAccounts,
      associatedOnly: true,
      checkCreateATAOwner: true,
    },
    routeProgram: programIds.Router,
    lookupTableCache: LOOKUP_TABLE_CACHE,
    makeTxVersion: makeTxVersion,
    computeBudgetConfig: {
      units: 800000,
      microLamports: 600000,
    },
  });

  return await buildAndSendTx(innerTransactions, accountPubkey);
}

export async function estTokenAmountOut({
  inputNumber,
  isDirection = false,
}: {
  inputNumber: number;
  isDirection?: boolean;
}) {
  // const inputToken = isDirection ? mpToken : wsol;
  // const outputToken = isDirection ? wsol : mpToken;
  // const inputTokenAmount = new TokenAmount(inputToken, inputNumber * 1e9); // 0.01 SOL
  console.log("isDirection: ", isDirection);
  // const sol = new Currency(9, "SOL", "SOL");
  const inputTokenAmount = isDirection
    ? new TokenAmount(mpToken, inputNumber * 10 ** mpToken.decimals, true)
    : new CurrencyAmount(sol, inputNumber * 1e9, true);
  const outputToken = isDirection ? sol : mpToken;

  const slippage = new Percent(1, 100); // 1%

  const clmmPools: ApiClmmPoolsItem[] = [await formatClmmKeysById(targetPool)];
  const { [targetPool]: clmmPoolInfo } = await Clmm.fetchMultiplePoolInfos({
    connection: CONNECTION,
    poolKeys: clmmPools,
    chainTime: new Date().getTime() / 1000,
  });

  const tickCache = await Clmm.fetchMultiplePoolTickArrays({
    connection: CONNECTION,
    poolKeys: [clmmPoolInfo.state],
    batchRequest: true,
  });

  const { minAmountOut } = Clmm.computeAmountOutFormat({
    poolInfo: clmmPoolInfo.state,
    tickArrayCache: tickCache[targetPool],
    amountIn: inputTokenAmount,
    currencyOut: outputToken,
    slippage: slippage,
    epochInfo: await CONNECTION.getEpochInfo(),
    token2022Infos: await fetchMultipleMintInfos({
      connection: CONNECTION,
      mints: [
        ...clmmPools
          .map((i) => [
            { mint: i.mintA, program: i.mintProgramIdA },
            { mint: i.mintB, program: i.mintProgramIdB },
          ])
          .flat()
          .filter((i) => i.program === TOKEN_2022_PROGRAM_ID.toString())
          .map((i) => new PublicKey(i.mint)),
      ],
    }),
    catchLiquidityInsufficient: false,
  });
  const estimateAmountOut = _d(
    clmmPoolInfo.state,
    minAmountOut.amount.raw,
    "B"
  );
  console.log("estimateAmountOut: ", estimateAmountOut.toString());

  return {
    amount: +minAmountOut.amount.raw.toString() / 1e9,
  };
}

async function getWalletTokenAccount(
  wallet: PublicKey
): Promise<TokenAccount[]> {
  const walletTokenAccount = await CONNECTION.getTokenAccountsByOwner(wallet, {
    programId: TOKEN_2022_PROGRAM_ID,
  });
  return walletTokenAccount.value.map((i) => ({
    pubkey: i.pubkey,
    programId: i.account.owner,
    accountInfo: SPL_ACCOUNT_LAYOUT.decode(i.account.data),
  }));
}

async function getMintProgram(mint: PublicKey) {
  const account = await CONNECTION.getAccountInfo(mint);
  if (account === null) throw Error(" get id info error ");
  return account.owner;
}

async function getConfigInfo(configId: PublicKey): Promise<ApiClmmConfigItem> {
  const account = await CONNECTION.getAccountInfo(configId);
  if (account === null) throw Error(" get id info error ");
  return formatConfigInfo(configId, account);
}

function formatConfigInfo(
  id: PublicKey,
  account: AccountInfo<Buffer>
): ApiClmmConfigItem {
  const info = AmmConfigLayout.decode(account.data);

  return {
    id: id.toBase58(),
    index: info.index,
    protocolFeeRate: info.protocolFeeRate,
    tradeFeeRate: info.tradeFeeRate,
    tickSpacing: info.tickSpacing,
    fundFeeRate: info.fundFeeRate,
    fundOwner: info.fundOwner.toString(),
    description: "",
  };
}

async function formatClmmKeysById(id: string): Promise<ApiClmmPoolsItem> {
  const account = await CONNECTION.getAccountInfo(new PublicKey(id));
  if (account === null) throw Error(" get id info error ");
  const info = PoolInfoLayout.decode(account.data);

  return {
    id,
    mintProgramIdA: (await getMintProgram(info.mintA)).toString(),
    mintProgramIdB: (await getMintProgram(info.mintB)).toString(),
    mintA: info.mintA.toString(),
    mintB: info.mintB.toString(),
    vaultA: info.vaultA.toString(),
    vaultB: info.vaultB.toString(),
    mintDecimalsA: info.mintDecimalsA,
    mintDecimalsB: info.mintDecimalsB,
    ammConfig: await getConfigInfo(info.ammConfig),
    rewardInfos: await Promise.all(
      info.rewardInfos
        .filter((i) => !i.tokenMint.equals(PublicKey.default))
        .map(async (i) => ({
          mint: i.tokenMint.toString(),
          programId: (await getMintProgram(i.tokenMint)).toString(),
        }))
    ),
    tvl: 0,
    day: getApiClmmPoolsItemStatisticsDefault(),
    week: getApiClmmPoolsItemStatisticsDefault(),
    month: getApiClmmPoolsItemStatisticsDefault(),
    lookupTableAccount: PublicKey.default.toBase58(),
  };
}

async function buildAndSendTx(
  innerSimpleV0Transaction: InnerSimpleV0Transaction[],
  payer: PublicKey
): Promise<(VersionedTransaction | Transaction)[]> {
  const willSendTx = await buildSimpleTransaction({
    connection: CONNECTION,
    makeTxVersion,
    payer: payer,
    innerTransactions: innerSimpleV0Transaction,
    addLookupTableInfo: addLookupTableInfo,
  });
  return willSendTx;
  // return await sendTx(willSendTx);
}

export async function sendTx(
  txs: (VersionedTransaction | Transaction)[]
): Promise<any[]> {
  const privateKey = localStorage.getItem(PRIVATE_KEY_B58);
  if (!privateKey) {
    throw new Error("Account Not Found. Please try to login again");
  }
  const payer = base58ToKeypair(privateKey);
  const resolves = txs.map(async (iTx) => {
    let sig = "";
    if (iTx instanceof VersionedTransaction) {
      iTx.sign([payer]);
      sig = await CONNECTION.sendTransaction(iTx, undefined);
    } else {
      sig = await CONNECTION.sendTransaction(iTx, [payer], undefined);
    }
    await CONNECTION.confirmTransaction(sig, "confirmed");
    return sig;
  });
  return await Promise.all(resolves);
}

function getApiClmmPoolsItemStatisticsDefault(): ApiClmmPoolsItemStatistics {
  return {
    volume: 0,
    volumeFee: 0,
    feeA: 0,
    feeB: 0,
    feeApr: 0,
    rewardApr: { A: 0, B: 0, C: 0 },
    apr: 0,
    priceMin: 0,
    priceMax: 0,
  };
}

function _d(poolInfo: ClmmPoolInfo, amount: any, type: "A" | "B") {
  const decimal = poolInfo[type === "A" ? "mintA" : "mintB"].decimals;
  return new Decimal(amount.toString()).div(new Decimal(10).pow(decimal));
}

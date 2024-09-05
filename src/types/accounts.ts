import { TokenAmount } from '@solana/web3.js';
import { FetchingState } from './common';

export type TBalance = {
  balanceAccount: TokenAmount;
  tokens: Record<string, TokenAmount>;
};

export type IAddress = {
  address?: string;
};

export type AccountState = IAddress & TBalance & FetchingState;

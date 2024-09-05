export enum TypeTransaction {
  SEND = "Send",
  SWAP = "Swap",
  DEPOSIT = "Deposit",
  MINT = "Mint",
  WITHDRAW = "Withdrawl",
}

export interface ITransactionStorage {
  type: TypeTransaction;
  hash: string;
  amount: number;
  symbol: string;
  timestamp: number;
}

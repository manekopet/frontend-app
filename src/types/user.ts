export interface User {
  id: number;
  publicAddress: string;
  publicTokenAddress: string;
  publicNFTAddress: string;
  referralCode: string;
  invitedBy: string;
  signed: number;
  incomeEarned?: number;
  frens?: number;
  name?: string;
}

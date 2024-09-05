import { User } from "./user";

// Định nghĩa trạng thái và action của bạn
export interface AuthAccount {
  appState?: string;
  email?: string;
  aggregateVerifier?: string;
  name?: string;
  profileImage?: string;
  typeOfLogin?: string;
  verifier?: string;
  verifierId?: string;
  dappShare?: string;
  oAuthIdToken?: string;
  oAuthAccessToken?: string;
  isMfaEnabled?: boolean;
  idToken?: string;
}

export interface AuthStateBalance {
  id: number;
  name: string;
  symbol: string;
  Address: string;
  balance: number;
  interest: number;
  status: number;
  itemId: number;
}

export interface SocialData {
  aggregateVerifier: string;
  appState: string;
  dappShare: string;
  email: string;
  id: number;
  idToken: string;
  isMfaEnabled: boolean;
  name: string;
  oAuthAccessToken: string;
  oAuthIdToken: string;
  profileImage: string;
  typeOfLogin: string;
  userId: number;
  verifier: string;
  verifierId: string;
  // : "twitter|1434071186753736707";
}

export enum ISymbol {
  MGEM = "MGEM",
  MP = "MP",
}

export interface AuthState {
  referral: string;
  isFinishOnboarding: boolean;
  isJustMint: boolean;
  signed: number;
  account: AuthAccount | null;
  accessToken: string;
  user: User | null;
  balance: Record<ISymbol, AuthStateBalance>;
  socialData: SocialData | null;
}

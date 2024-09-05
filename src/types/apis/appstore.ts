import { Game } from "../game";

export interface AppStorePlayGameSession {
  id: number;
  createdAt: string;
  appApiKey: string;
  userId: number;
  nftId: string;
  sessionId: string;
  sessionMgemRewards: number;
  sessionPTSRewards: number;
  status: number;
}

export interface AppStorePlayGameResponse {
  diff: number;
  session: AppStorePlayGameSession;
  message: string;
  status: number;
}

export interface AppStoreGetListResponse {
  results: Game[];
  status: number;
}

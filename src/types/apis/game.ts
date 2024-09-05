import { Activity } from "../activity";
import { Pet } from "../pet";

export interface LeaderboardGetListResponse {
  data: Pet[];
  message: string;
  status: number;
  total: number;
}

export interface ActivityGetListResponse {
  data: Activity[];
  message: string;
  status: number;
  total: number;
}

export interface ActivityGetListResponse {
  data: Activity[];
  message: string;
  status: number;
  total: number;
}

export interface HitResponse {
  fromId: Pet;
  message: string;
  status: number;
  rewards: string;
  nft: Pet;
  points: number;
  isWin: number;
}

export interface SpinResponse {
  activity: Activity;
  message: string;
  rewards: SpinResponseRewards;
  status: number;
}

export interface SpinResponseRewards {
  id: number;
  createdAt: string;
  tx: string;
  address: string;
  proof: string;
  index: number;
  status: number;
  Reward: string;
}

export interface SpinCheckResponse {
  diff: number;
  message: string;
  data: SpinResponseRewards;
  status: number;
}

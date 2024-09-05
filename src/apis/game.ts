import { axiosPrivate } from "@/http/axiosPrivate";
import { Activity } from "@/types/activity";
import {
  ActivityGetListResponse,
  HitResponse,
  LeaderboardGetListResponse,
  SpinCheckResponse,
  SpinResponse,
} from "@/types/apis/game";
import { Pet } from "@/types/pet";

export const leaderboardGetList = async (
  order: number,
  limit: number
): Promise<{ data: Pet[]; total: number }> => {
  const res = await axiosPrivate.get<LeaderboardGetListResponse>(
    `/game/leaderboard/${limit}/${order}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (res.status !== 200) {
    throw new Error("bad request");
  }

  if (res.data.status !== 1) {
    throw new Error("bad request");
  }

  const { total, data } = res.data;

  return { data, total };
};

export const activityGetList = async (
  type: any,
  order: number,
  limit: number
): Promise<{ data: Activity[]; total: number }> => {
  const res = await axiosPrivate.get<ActivityGetListResponse>(
    `/game/activity/${type}/${order}/${limit}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (res.status !== 200) {
    throw new Error("bad request");
  }

  if (res.data.status !== 1) {
    throw new Error("bad request");
  }

  const { total, data } = res.data;

  return { data, total };
};

export const hit = async (
  tokenAccountAddress: string,
  fromNtfId: string,
  toNftId: string
): Promise<{
  message: string;
  rewards: string;
  points: number;
  isWin: number;
}> => {
  const data = {
    tokenAccountAddress,
    attackFromNftId: fromNtfId,
    nftId: toNftId,
  };
  const res = await axiosPrivate.post<HitResponse>(`/game/hit`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (res.status !== 200) {
    throw new Error("bad request");
  }

  const { message, rewards, points, isWin } = res.data;

  return { message, rewards, points, isWin };
};

export const getConfigs = async () => {
  const res = await axiosPrivate.get(`/global`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (res.status !== 200) {
    throw new Error("bad request");
  }

  if (res.data.status !== 1) {
    throw new Error("bad request");
  }
  return res.data;
};

export const spin = async (
  nftId: string
): Promise<{ message: string; rewardIndex: number }> => {
  const res: any = await axiosPrivate.post<SpinResponse>(`game/spin/${nftId}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (res.status !== 200) {
    throw new Error(res.message);
  }

  if (res.data.status !== 1) {
    throw new Error(res.data.message);
  }

  const {
    activity: { message },
    rewards: { index },
  } = res.data;

  return { message, rewardIndex: index };
};

export const spinCheck = async (nftId: string): Promise<{ diff: number }> => {
  const res: any = await axiosPrivate.get<SpinCheckResponse>(
    `game/spin/check/${nftId}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (res.status !== 200) {
    throw new Error(res.message);
  }

  if (res.data.status !== 1) {
    throw new Error(res.data.message);
  }

  const { diff } = res.data;

  return { diff };
};

export const getAchievement = async (nftId: any) => {
  const res = await axiosPrivate.get(`/game/achievement/${nftId}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (res.status !== 200) {
    throw new Error("bad request");
  }

  if (res.data.status !== 1) {
    throw new Error("bad request");
  }
  return res.data;
};

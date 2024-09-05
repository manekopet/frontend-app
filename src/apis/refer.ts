import { axiosPrivate } from "@/http/axiosPrivate";
import { User } from "@/types/user";

export interface ReferLeaderboardResponse {
  results: User[];
}

export const referLeaderboard = async (): Promise<{ data: User[] }> => {
  const res = await axiosPrivate.get<ReferLeaderboardResponse>(
    `/refer/leaderboard`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (res.status !== 200) {
    throw new Error("bad request");
  }

  const { results } = res.data;

  return { data: results };
};

export interface RewardsEarnClaimResponse {
  message: string;
  status: number;
  data: any;
}

export const rewardsEarnClaim = async () => {
  const res = await axiosPrivate.get<RewardsEarnClaimResponse>(
    `refer/claim-rewards`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (res.status !== 200) {
    throw new Error("bad request");
  }

  const data = res.data;

  return { data };
};

export const rewardsEarnClaimV2 = async ({
  itemId,
  amount,
}: {
  itemId: number;
  amount: number;
}) => {
  const body = {
    itemId,
    amount,
  };
  const res = await axiosPrivate.post<RewardsEarnClaimResponse>(
    `/user/balance/withdraw`,
    body,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (res.status !== 200) {
    throw new Error("bad request");
  }

  const data = res.data;

  return { data };
};

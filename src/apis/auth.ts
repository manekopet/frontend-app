import { axiosPrivate } from "@/http/axiosPrivate";
import { axiosPublic } from "@/http/axiosPublic";
import { AuthLoginResponse } from "@/types/apis/auth";
import { User } from "@/types/user";

export const login = async (
  publicAddress: string,
  signedString: string,
  nonce: string,
  infoUser: any
): Promise<{ token: string; user: User }> => {
  const data = {
    publicAddress: publicAddress,
    signedString: signedString,
    nonce: nonce,
    socialdata: infoUser,
  };
  const res = await axiosPublic.post<AuthLoginResponse>(`/auth`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (res.status !== 200) {
    throw new Error("bad request");
  }

  return res.data;
};

export const requestNonce = async (
  publicAddress: string
): Promise<{ token: string; user: User }> => {
  const data = {
    publicAddress: publicAddress,
  };
  const res = await axiosPublic.post<AuthLoginResponse>(`/nonce`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (res.status !== 200) {
    throw new Error("bad request");
  }

  return res.data;
};

export const updateReferralProfile = async (
  publicAddress: any,
  invitedBy: any
): Promise<{ message: string; rewardIndex: number }> => {
  const data = {
    publicAddress: publicAddress,
    invitedBy: invitedBy,
  };

  const res: any = await axiosPrivate.post<any>(
    `/user/profile/update-referral`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return res?.data;
};

export const getProfile = async (): Promise<any> => {
  const res: any = await axiosPrivate.get<any>(`/user/profile`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res?.data;
};
export const getHistoryWallet = async (): Promise<any> => {
  const res: any = await axiosPrivate.get<any>(`/user/balance/history`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res?.data?.results || [];
};

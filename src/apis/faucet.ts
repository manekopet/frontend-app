import { axiosPrivate } from "@/http/axiosPrivate";

export const getFaucet = async (address: string) => {
  const res = await axiosPrivate.get(`/token/faucet/${address}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (res.status !== 200) {
    throw new Error("bad request");
  }

  return res.data;
};

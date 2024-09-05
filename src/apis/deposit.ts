import { axiosPrivate } from "@/http/axiosPrivate";

export const depositToken = async (itemTx: string) => {
  const data = {
    itemTx,
    itemOrderId: "deposit",
  };

  const res = await axiosPrivate.post(`user/balance/deposit`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.data;
};

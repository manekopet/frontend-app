import { axiosPublic } from "@/http/axiosPublic";
import { GlobalConfig } from "@/types/app";

export const global = async (): Promise<GlobalConfig> => {
  const res = await axiosPublic.get<GlobalConfig>(`/global`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (res.status !== 200) {
    throw new Error("bad request");
  }

  return res.data;
};

import { axiosPrivate } from "@/http/axiosPrivate";
import { axiosPublic } from "@/http/axiosPublic";

export const revealNft = (nftMint: string) => {
  return axiosPublic.post("/reveal", {
    nftMint: nftMint,
  });
};

// export const getNfts = (account: string) => {
//   return axiosPublic.get(`nfts/${account}`);
// };

export const getNfts = async () => {
  const res = await axiosPrivate.get(`pet/mypets`, {
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

  const { total, data } = res.data;

  return { data, total };
};

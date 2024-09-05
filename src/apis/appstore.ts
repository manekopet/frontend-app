import { axiosPrivate } from "@/http/axiosPrivate";
import {
  AppStoreGetListResponse,
  AppStorePlayGameResponse,
  AppStorePlayGameSession,
} from "@/types/apis/appstore";
import { Game } from "@/types/game";
import moment from "moment";

export const getList = async (): Promise<Game[]> => {
  const res = await axiosPrivate.get<AppStoreGetListResponse>(
    `/appstore/list`,
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

  const { results } = res.data;

  return results;
};

export const getSessionPlay = async (
  appApiKey: string,
  nftId: string
): Promise<{ session: AppStorePlayGameSession }> => {
  const data = {
    appApiKey,
    nftId,
  };

  const res = await axiosPrivate.post<AppStorePlayGameResponse>(
    `appstore/playgame/start`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (res.status !== 200) {
    throw new Error("bad request");
  }

  if (res.data.status === 0) {
    let duration = moment.duration(res.data.diff * 1000, "milliseconds");
    const hours = Math.floor(duration.asHours());
    const minutes = duration.minutes();
    const seconds = duration.seconds();
    const time = `${hours > 0 ? `${hours}h` : ""}${
      minutes > 0 ? `${minutes}m` : ""
    }${seconds}s`;
    throw new Error(`${res.data.message}. Remain-time to play: ${time}`);
  }

  if (res.data.status !== 1) {
    throw new Error(res.data.message);
  }

  return { session: res.data.session };
};

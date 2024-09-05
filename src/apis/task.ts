import { axiosPrivate } from "@/http/axiosPrivate";
import { TaskAllResponse, TaskSocialResponse } from "@/types/apis/task";
import { Task } from "@/types/task";

export const taskAll = async (): Promise<Task[]> => {
  const res = await axiosPrivate.get<TaskAllResponse>(`/task/all`, {
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

  const { taskList } = res.data;

  return taskList;
};

export const taskComplete = async (): Promise<Task[]> => {
  const res = await axiosPrivate.get<TaskAllResponse>(`/task/mytask`, {
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

  const { taskList } = res.data;

  return taskList;
};

export const taskSocialTwitterRetweet = async (
  username: string
): Promise<{ mgem: number; points: number; status: number }> => {
  const res = await axiosPrivate.get<TaskSocialResponse>(
    `/task/retweet/${username}`,
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

  const { mgem, points, status } = res.data;

  return { mgem, points, status };
};

export const taskSocialTwitter = async (
  username: string
): Promise<{ mgem: number; points: number; status: number }> => {
  const res = await axiosPrivate.get<TaskSocialResponse>(
    `/task/social/twitter/${username}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (res.status !== 200) {
    throw new Error("bad request");
  }

  const { mgem, points, status } = res.data;

  return { mgem, points, status };
};

export const taskCheckDaily = async (
  petNftId: string
): Promise<{ mgem: number; points: number; status: number }> => {
  const res = await axiosPrivate.get<TaskSocialResponse>(
    `/task/checkdaily/${petNftId}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (res.status !== 200) {
    throw new Error("bad request");
  }

  const { mgem, points, status } = res.data;

  return { mgem, points, status };
};

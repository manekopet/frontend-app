import { ENVS } from "@/configs/Configs.env";
import type { InternalAxiosRequestConfig } from "axios";
import axios from "axios";

axios.defaults.baseURL = ENVS.REACT_APP_API_ENDPOINT;

axios.interceptors.request.use(
  async (config: InternalAxiosRequestConfig<any>) => {
    const accessToken = window.token;
    if (accessToken) {
      config.headers.setAuthorization(`Bearer ${accessToken}`);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error?.config;
    if (error?.response?.status === 401 && !config?.sent) {
      config.sent = true;
      // do refresh token here
      // const result = await memoizedRefreshToken();

      // if (result?.access_token) {
      //   config.headers = {
      //     ...config.headers,
      //     authorization: `Bearer ${result?.access_token}`,
      //   };
      // }

      return axios(config);
    }
    return Promise.reject(error);
  }
);
export const axiosPrivate = axios;

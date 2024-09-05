import axios, { AxiosError } from "axios";
import { ENVS } from "../configs/Configs.env";
import { camelCaseKeys } from "../utils/camelcase";

const TIMEOUT = 20000;
const instance = axios.create({
  timeout: TIMEOUT,
});

const HEADERS = { "Content-Type": "application/json" };
let accessToken = window.token;

instance.interceptors.request.use(
  (req: any) => {
    req.baseURL = ENVS.REACT_APP_API_ENDPOINT;
    let authen = {};
    if (accessToken) {
      authen = { Authorization: `Bearer ${window.token}` };
    }
    req.headers = {
      ...HEADERS,
      ...req.headers,
      ...authen,
    };
    return req;
  },
  (error) => {
    Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (res) => {
    const result = res?.data?.result;
    const error = res?.data?.error;
    if (error) {
      return Promise.reject(camelCaseKeys(error));
    }
    return Promise.resolve(result);
  },
  (axiosError: AxiosError) => {
    if (axiosError?.isAxiosError && !axiosError?.response) {
      throw new Error("Send request API failed");
    }
    const { response: { data } = {} } = axiosError;
    const { error }: any = data || {};
    return Promise.reject(camelCaseKeys(error || axiosError));
  }
);

export const setAccessToken = (token: string) => {
  accessToken = token;
};

export default instance;

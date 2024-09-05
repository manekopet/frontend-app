import { ENVS } from "@/configs/Configs.env";
import axios from "axios";

export const axiosPublic = axios.create({
  baseURL: ENVS.REACT_APP_API_ENDPOINT,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

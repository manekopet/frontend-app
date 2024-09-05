import { User } from "../user";

export interface AuthLoginResponse {
  token: string;
  user: User;
}

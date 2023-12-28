import { User } from "./user.interface";

export interface LoginResponse {
  username: User;
  token: string;
}

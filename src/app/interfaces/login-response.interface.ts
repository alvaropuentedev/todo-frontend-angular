import { User } from "./user.interface";

export interface LoginResponse {
  id_user: number;
  username: User;
  token: string;
}

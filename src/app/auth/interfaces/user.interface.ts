export interface User {
  _id: number;
  username: string;
  password: string;
  isActive: boolean;
  roles: string[];
}

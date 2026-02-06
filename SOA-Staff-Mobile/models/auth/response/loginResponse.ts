import { User } from "../entity/user";

/**
 * Login response payload - matches API LoginResponse
 */
export interface LoginResponse {
  accessToken: string;
  user: User;
}

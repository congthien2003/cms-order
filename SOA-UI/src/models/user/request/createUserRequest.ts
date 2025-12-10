export interface CreateUserRequest {
  fullName: string;
  userName: string;
  email: string;
  password: string;
  roleIds: string[];
}

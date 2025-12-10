export interface UpdateUserRequest {
  fullName?: string;
  userName?: string;
  email?: string;
  password?: string;
  roleIds?: string[];
  phoneNumber?: string;
  isActive?: boolean;
}

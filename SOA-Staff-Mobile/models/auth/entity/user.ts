/**
 * User entity - matches API UserInfoResponse
 */
export interface User {
  id: string;
  userName: string;
  fullName: string;
  email: string;
  isEmailConfirmed: boolean;
  phoneNumber?: string;
  isPhoneNumberConfirmed?: boolean;
  lastLoginAt?: string;
  roles: string[];
  profilePictureUrl?: string;
  isActive: boolean;
}

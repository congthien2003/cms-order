export interface UserDetailResponse {
  id: string;
  email: string;
  userName: string;
  fullName: string;
  avatar?: string;
  roles: { id: string; name: string }[];
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  phoneNumber: string;
  address: string;
  profilePictureUrl?: string;
}

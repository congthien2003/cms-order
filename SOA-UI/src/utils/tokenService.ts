/* eslint-disable @typescript-eslint/no-explicit-any */
import { claimTypesConstants } from '@/constants/claimTypes';
import { jwtDecode } from 'jwt-decode';

export interface UserInfo {
  nameid: string;
  fullName: string;
  email: string;
  roles: string[];
  exp: number;
}

export class TokenService {
  getAccessToken(): string {
    return sessionStorage.getItem('accessToken') || '';
  }

  getCurrentRoles(): string[] {
    const user = this.getUserInfo();
    return user?.roles ?? [];
  }

  getUserInfo(): UserInfo | null {
    const token = this.getAccessToken();
    if (!token) return null;

    try {
      const claims = jwtDecode<any>(token);
      const user: UserInfo = {
        nameid: claims[claimTypesConstants.id],
        fullName: claims[claimTypesConstants.fullName],
        email: claims[claimTypesConstants.email],
        roles: claims[claimTypesConstants.roles],
        exp: claims[claimTypesConstants.exp],
      };
      return user;
    } catch (error) {
      console.error('Decode token failed', error);
      return null;
    }
  }
}

import type { User } from '@/models/user/entity/user';
import { useState, useEffect } from 'react';
import { AuthContext } from './authContext';
import { authService } from '@/services/authService';
import {
  SessionStorageKey,
  getSessionStorage,
  setSessionStorage,
  removeSessionStorage,
} from '@/lib/sessionStorage';

export type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // Kiểm tra token khi component mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = getSessionStorage(SessionStorageKey.ACCESS_TOKEN);
      if (token) {
        setIsAuthenticated(true);
        // TODO: Fetch user info from token hoặc API
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      // AuthResponse has tokens property directly (not wrapped in ApiResponse)
      if (response.accessToken) {
        setSessionStorage(SessionStorageKey.ACCESS_TOKEN, response.accessToken);
        setIsAuthenticated(true);
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    removeSessionStorage(SessionStorageKey.ACCESS_TOKEN);
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

import type { User } from '@/models/user/entity/user';
import { useState, useEffect } from 'react';
import { AuthContext } from './authContext';

export type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Kiểm tra token khi component mount
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsAuthenticated(true);
      // TODO: Fetch user info from token hoặc API
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // TODO: Implement login API call
      console.log('login', email, password);

      // Giả lập login thành công
      const mockToken = 'mock-access-token';
      localStorage.setItem('accessToken', mockToken);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

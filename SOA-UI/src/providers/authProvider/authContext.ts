import { createContext } from 'react';
import type { AuthContextType } from './AuthProvider';

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: () => Promise.resolve(),
  logout: () => {},
});

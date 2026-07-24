import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { getMe } from '../services/authService';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  skills: string[];
  university?: string;
  degree?: string;
  graduationYear?: number;
  resume?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  setUser: (user: User | null) => void;
  login: (token: string, user: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const data = await getMe();
      setUser(data as unknown as User);
    } catch {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchUser().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token, fetchUser]);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('role', newUser.role);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('role');
    localStorage.removeItem('rememberedUser');
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    await fetchUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isAdmin: user?.role === 'admin',
        loading,
        setUser,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

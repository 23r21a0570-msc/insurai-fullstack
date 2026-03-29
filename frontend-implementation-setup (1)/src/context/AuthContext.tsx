import { createContext, useState, useCallback, useEffect, ReactNode, useContext } from 'react';
import { User, UserRole } from '@/types';
import { authAPI } from '@/api/apiService';

const TOKEN_KEY = 'insurai_token';
const USER_KEY = 'insurai_user';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role?: UserRole | 'customer' | 'admin') => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setLoading] = useState(true);

  // Rehydrate from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(USER_KEY);
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem(USER_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(
    async (email: string, password: string, role?: UserRole | 'customer' | 'admin') => {
      setLoading(true);

      try {
        // Call real backend API
        const response = await authAPI.login(email, password, role);

        const u: User = {
          id: response.user.id,
          email: response.user.email,
          name: response.user.name,
          role: response.user.role.toLowerCase() as UserRole,
          avatar: response.user.avatar,
          department: response.user.department,
          isActive: response.user.isActive,
          createdAt: new Date().toISOString(),
        };

        setUser(u);
        localStorage.setItem(USER_KEY, JSON.stringify(u));
        // Token is already saved by authAPI.login()
      } catch (error: any) {
        setLoading(false);
        throw new Error(error.message || 'Invalid credentials');
      }

      setLoading(false);
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
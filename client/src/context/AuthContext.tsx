import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, authApi } from '@/services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register';
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  deleteAccount: () => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('wayfound_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  // Verify and fetch profile on load if token is stored
  const refreshUser = useCallback(async () => {
    const storedToken = localStorage.getItem('wayfound_token');
    if (!storedToken) {
      setUser(null);
      setToken(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await authApi.getMe();
      const currentUser = (res as any)?.user || (res as any)?.data;
      if (currentUser) {
        setUser(currentUser);
        setToken(storedToken);
      } else {
        localStorage.removeItem('wayfound_token');
        setUser(null);
        setToken(null);
      }
    } catch (err) {
      console.warn('Session expired or invalid token:', err);
      localStorage.removeItem('wayfound_token');
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    const res = await authApi.login({ email, password });
    const currentUser = (res as any)?.user || (res as any)?.data;
    setUser(currentUser);
    setToken(res.token);
    setIsAuthModalOpen(false);
  };

  const register = async (name: string, email: string, password: string, phone?: string) => {
    const res = await authApi.register({ name, email, password, phone });
    const currentUser = (res as any)?.user || (res as any)?.data;
    setUser(currentUser);
    setToken(res.token);
    setIsAuthModalOpen(false);
  };

  const updateProfile = async (updates: Partial<User>) => {
    const res = await authApi.updateProfile(updates);
    const updated = (res as any)?.user || (res as any)?.data;
    if (updated) {
      setUser(updated);
    }
  };

  const deleteAccount = async () => {
    await authApi.deleteAccount();
    setUser(null);
    setToken(null);
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
    setToken(null);
  };

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        isAuthModalOpen,
        authModalMode,
        login,
        register,
        updateProfile,
        deleteAccount,
        logout,
        refreshUser,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>

  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

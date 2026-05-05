import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { base44Client } from '@/api/base44Client';
import { getAppParams } from './app-params';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthError {
  type: 'auth_required' | 'user_not_registered' | 'unknown';
  message: string;
}

interface AuthContextType {
  user: User | null;
  isLoadingAuth: boolean;
  isLoadingPublicSettings: boolean;
  authError: AuthError | null;
  navigateToLogin: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(true);
  const [authError, setAuthError] = useState<AuthError | null>(null);

  useEffect(() => {
    checkAuth();
    loadPublicSettings();
  }, []);

  const checkAuth = async () => {
    try {
      setIsLoadingAuth(true);
      const response = await base44Client.get('/api/auth/me');
      setUser(response.data.user);
      setAuthError(null);
    } catch (error: any) {
      console.error('Auth check failed:', error);
      
      if (error.response?.status === 401) {
        setAuthError({
          type: 'auth_required',
          message: 'Authentication required'
        });
      } else if (error.response?.status === 403) {
        setAuthError({
          type: 'user_not_registered',
          message: 'User not registered for this app'
        });
      } else {
        setAuthError({
          type: 'unknown',
          message: error.message || 'Authentication failed'
        });
      }
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const loadPublicSettings = async () => {
    try {
      setIsLoadingPublicSettings(true);
      const { appId } = getAppParams();
      
      // Load any public settings/configuration here
      // For now, just simulate a brief loading state
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error('Failed to load public settings:', error);
    } finally {
      setIsLoadingPublicSettings(false);
    }
  };

  const navigateToLogin = () => {
    const { appId } = getAppParams();
    window.location.href = `https://apps.webflow.com/workspace/authorize/${appId}`;
  };

  const logout = async () => {
    try {
      await base44Client.post('/api/auth/logout');
      setUser(null);
      navigateToLogin();
    } catch (error) {
      console.error('Logout failed:', error);
      // Still clear local state and redirect
      setUser(null);
      navigateToLogin();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoadingAuth,
        isLoadingPublicSettings,
        authError,
        navigateToLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

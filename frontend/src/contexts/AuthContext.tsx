import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/services/api';

interface User {
  id: string;
  email: string;
  role: string;
  lastLogin?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!token;

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setToken(storedToken);
          setUser(parsedUser);
        } catch (error) {
          console.error('Error parsing stored user:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('🧪 Login attempt:', { email, password: '***' });
      const response = await api.auth.login({ email, password });
      console.log('🔄 API response:', response);
      
      if (response.success) {
        // Handle direct response format (token and user are at root level)
        const { token: authToken, user: userData } = response as any;
        
        if (!authToken || !userData) {
          throw new Error('Invalid response format: missing token or user data');
        }
        
        setToken(authToken);
        setUser(userData);
        
        localStorage.setItem('token', authToken);
        localStorage.setItem('user', JSON.stringify(userData));
        
        console.log('✅ Login successful for:', userData.email);
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('❌ Login error:', error);
      
      // Provide more specific error messages
      if (error.message?.includes('fetch')) {
        throw new Error('Unable to connect to server. Please check your internet connection.');
      } else if (error.message?.includes('401')) {
        throw new Error('Invalid email or password.');
      } else if (error.message?.includes('500')) {
        throw new Error('Server error. Please try again later.');
      }
      
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Call logout API to clear server-side session/cookies
      await api.auth.logout();
    } catch (error) {
      console.error('Logout API error:', error);
      // Continue with client-side logout even if API fails
    } finally {
      // Clear client-side state
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  const checkAuth = async () => {
    if (!token) return;

    try {
      const response = await api.auth.me();
      
      if (response.success && (response as any).user) {
        setUser((response as any).user as User);
      } else {
        // Token is invalid, clear auth state
        logout();
      }
    } catch (error) {
      console.error('Auth check error:', error);
      // Token is invalid, clear auth state
      logout();
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

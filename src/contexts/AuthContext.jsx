import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/auth';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('learntrace_token') || null);
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('learntrace_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Validate session on mount
  useEffect(() => {
    let mounted = true;

    async function validateAuth() {
      const storedToken = localStorage.getItem('learntrace_token');
      if (!storedToken) {
        if (mounted) setLoading(false);
        return;
      }

      try {
        const response = await authService.getMe();
        if (mounted) {
          const userData = response.user || response.data?.user || response;
          setUser(userData);
          localStorage.setItem('learntrace_user', JSON.stringify(userData));
        }
      } catch (err) {
        // If 401 Unauthorized or invalid token, clean up
        if (err.response?.status === 401) {
          if (mounted) {
            setToken(null);
            setUser(null);
            localStorage.removeItem('learntrace_token');
            localStorage.removeItem('learntrace_user');
          }
        }
        // If server is unreachable or offline, keep stored user for smooth dev experience
      } finally {
        if (mounted) setLoading(false);
      }
    }

    validateAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await authService.login({ email, password });
    const authToken = data.token || data.data?.token || data.accessToken;
    const authUser = data.user || data.data?.user || { email, name: email.split('@')[0] };

    if (authToken) {
      localStorage.setItem('learntrace_token', authToken);
      setToken(authToken);
    }
    if (authUser) {
      localStorage.setItem('learntrace_user', JSON.stringify(authUser));
      setUser(authUser);
    }
    return data;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const data = await authService.register({ name, email, password });
    const authToken = data.token || data.data?.token || data.accessToken;
    const authUser = data.user || data.data?.user || { name, email };

    if (authToken) {
      localStorage.setItem('learntrace_token', authToken);
      setToken(authToken);
    }
    if (authUser) {
      localStorage.setItem('learntrace_user', JSON.stringify(authUser));
      setUser(authUser);
    }
    return data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // ignore
    } finally {
      localStorage.removeItem('learntrace_token');
      localStorage.removeItem('learntrace_user');
      setToken(null);
      setUser(null);
    }
  }, []);

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    login,
    register,
    logout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

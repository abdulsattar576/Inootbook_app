import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const json = localStorage.getItem('user');
    return json ? JSON.parse(json) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  const login = async (email, password) => {
    const { user: u, token } = await authApi.login({ email, password });
    localStorage.setItem('token', token);
    setUser(u);
  };

  const register = async (username, email, password) => {
    const { user: u, token } = await authApi.register({ username, email, password });
    localStorage.setItem('token', token);
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = useMemo(() => ({ user, login, register, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}


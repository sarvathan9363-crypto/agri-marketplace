import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('agribazaar_token');
      if (!token) {
        setLoading(false);
        return;
      }
      const data = await authService.getMe();
      setUser(data.user);
      setProfile(data.profile);
    } catch {
      localStorage.removeItem('agribazaar_token');
      localStorage.removeItem('agribazaar_user');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    localStorage.setItem('agribazaar_token', data.token);
    localStorage.setItem('agribazaar_user', JSON.stringify(data.user));
    setUser(data.user);
    setProfile(data.profile);
    return data;
  };

  const registerFarmer = async (formData) => {
    const data = await authService.registerFarmer(formData);
    localStorage.setItem('agribazaar_token', data.token);
    localStorage.setItem('agribazaar_user', JSON.stringify(data.user));
    setUser(data.user);
    setProfile(data.farmer);
    return data;
  };

  const registerBuyer = async (formData) => {
    const data = await authService.registerBuyer(formData);
    localStorage.setItem('agribazaar_token', data.token);
    localStorage.setItem('agribazaar_user', JSON.stringify(data.user));
    setUser(data.user);
    setProfile(data.buyer);
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setProfile(null);
  };

  const value = {
    user,
    profile,
    loading,
    login,
    registerFarmer,
    registerBuyer,
    logout,
    isAuthenticated: !!user,
    isFarmer: user?.role === 'FARMER',
    isBuyer: user?.role === 'BUYER',
    isAdmin: user?.role === 'ADMIN',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

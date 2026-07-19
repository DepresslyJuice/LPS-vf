import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

export interface User {
  idUsuario: number;
  email: string;
  nombre: string;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: any) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (roleName: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check session on mount
    const checkSession = async () => {
      try {
        const profile = await api.getProfile();
        setUser({
          idUsuario: profile.idUsuario,
          email: profile.email,
          nombre: profile.nombre,
          roles: profile.roles || [],
        });
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = async (credentials: any) => {
    await api.login(credentials);
    // Fetch profile after successful login
    const profile = await api.getProfile();
    setUser({
      idUsuario: profile.idUsuario,
      email: profile.email,
      nombre: profile.nombre,
      roles: profile.roles || [],
    });
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (e) {
      console.error(e);
    } finally {
      setUser(null);
    }
  };

  const hasRole = (roleName: string) => {
    if (!user) return false;
    return user.roles.includes(roleName) || user.roles.includes('admin'); // admin overrides
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

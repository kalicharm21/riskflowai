import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'Chief Risk Officer' | 'Senior Risk Analyst' | 'Portfolio Manager' | 'Compliance Auditor';
  avatarUrl?: string;
  initials: string;
  authenticated: boolean;
}

interface AuthContextType {
  user: UserProfile;
  loginModalOpen: boolean;
  setLoginModalOpen: (open: boolean) => void;
  loginAs: (role: UserProfile['role'], name?: string, email?: string) => void;
  logout: () => void;
}

const DEFAULT_USER: UserProfile = {
  id: 'usr-analyst-1',
  name: 'Senior Risk Analyst',
  email: 'risk.director@riskflow.internal',
  role: 'Senior Risk Analyst',
  initials: 'RA',
  authenticated: true,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('riskflow_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return DEFAULT_USER;
  });

  const [loginModalOpen, setLoginModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('riskflow_user', JSON.stringify(user));
  }, [user]);

  const loginAs = (role: UserProfile['role'], name = 'Institutional User', email = 'user@riskflow.internal') => {
    const initials = name
      .split(' ')
      .map((p) => p[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    setUser({
      id: `usr-${Date.now()}`,
      name,
      email,
      role,
      initials: initials || 'UR',
      authenticated: true,
    });
    setLoginModalOpen(false);
  };

  const logout = () => {
    setUser({
      ...DEFAULT_USER,
      authenticated: false,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loginModalOpen,
        setLoginModalOpen,
        loginAs,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

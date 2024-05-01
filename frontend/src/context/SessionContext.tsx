import React, { createContext, useState, useContext, ReactNode } from 'react';

interface SessionContextType {
  sessionUser: string | null;
  login: (sessionUser: string) => void;
  logout: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export const SessionProvider: React.FC<Props> = ({ children }) => {
  const [username, setUsername] = useState<string | null>(localStorage.getItem('username'));

  const sessionUser = username;

  const login = (newUsername: string) => {
    localStorage.setItem('username', newUsername);
    setUsername(newUsername);
  };

  const logout = () => {
    localStorage.removeItem('username');
    setUsername(null);
  };

  return (
    <SessionContext.Provider value={{ sessionUser, login, logout }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }

  return context;
};
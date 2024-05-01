import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import axios from 'axios';

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
  const [username, setUsername] = useState<string | null>(null);

  const sessionUser = username;

  const login = (newUsername: string) => {
    setUsername(newUsername);
  };

  const logout = () => {
    setUsername(null);
  };

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users/session`)
      .then(response => {
        if (response.data) {
          setUsername(response.data.username);
        }
      })
      .catch(error => {
        console.error('Error getting session:', error);
      });
  }, []);

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
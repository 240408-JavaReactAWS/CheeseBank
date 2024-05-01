import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { User } from '../models/User'; // Adjust the import path according to your project structure

interface SessionContextType {
  sessionUser: User | null;
  login: (sessionUser: User) => void;
  logout: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export const SessionProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const sessionUser = user;

  const login = (newUser: User) => {
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users/session`)
      .then(response => {
        if (response.data) {
          setUser(response.data);
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
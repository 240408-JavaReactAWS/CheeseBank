import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { User } from '../models/User'; // Adjust the import path according to your project structure

interface SessionContextType {
  sessionUser: User | null;
  sessionAdmin: User | null;
  login: (sessionUser: User) => void;
  logout: () => void;
  validateAdminSession: () => Promise<void>;
  validateUserSession: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export const SessionProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [admin, setAdmin] = useState<User | null>(null);

  const sessionUser = user;
  const sessionAdmin = admin;

  const login = (newUser: User) => {
    if (newUser.userType === 'ADMIN') {
      setAdmin(newUser);
    }
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
    setAdmin(null);
  };

  const validateAdminSession = async () => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users/admin`)
      .then(response => {
        if (response.data) {
          setAdmin(response.data)
        }
      })
      .catch(error => {
        console.error('Error validating admin session:', error);
      });
  };

  const validateUserSession = async () => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users/session`)
      .then(response => {
        if (response.data) {
          setUser(response.data);
        }
      })
      .catch(error => {
        console.error('Error validating user session:', error);
      });
  }

  useEffect(() => {
    validateUserSession();
    validateAdminSession();
  }, []);

  return (
    <SessionContext.Provider value={{ sessionUser, sessionAdmin, login, logout, validateAdminSession, validateUserSession }}>
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
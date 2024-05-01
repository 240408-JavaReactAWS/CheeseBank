import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSession } from '../../context/SessionContext';

interface PrivateRouteProps {
  element: React.ReactElement;
  roles: string[];
  redirectTo: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element, roles, redirectTo }) => {
  const { sessionUser } = useSession();

  if (sessionUser === null) {
    return null;
  }

  if (sessionUser === undefined) {
    return <Navigate to={redirectTo} />;
  }

  if (!roles.includes(sessionUser.userType)) {
    return <Navigate to={redirectTo} />;
  }

  return element;
};

export default PrivateRoute;
import React from 'react';
import UserTable from '../components/UserTable/UserTable';
import { useSession } from '../context/SessionContext';

const AdminDashboard: React.FC = () => {
  const { sessionUser } = useSession();
  console.log(sessionUser);
  if (!sessionUser || sessionUser.userType !== 'ADMIN') {
    return <p>Please log in as an Admin to view this page.</p>;
  }

  return (
    <div>
      <UserTable />
    </div>
  );
};

export default AdminDashboard;
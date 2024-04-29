import React from 'react';
import Profile from '../components/Profile/Profile';
import Balance from '../components/Balance/Balance';
import TransactionHistory from '../components/TransactionHistory/TransactionHistory';

const Dashboard: React.FC = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <Profile />
      <Balance />
      {/* <TransactionHistory /> */}
    </div>
  );
};

export default Dashboard;
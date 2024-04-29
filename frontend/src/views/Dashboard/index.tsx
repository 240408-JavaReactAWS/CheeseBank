import React from 'react';
import Profile from './Profile';
import Balance from './Balance';
import Transaction from './Transaction';
import TransactionHistory from './TransactionHistory';

const Dashboard: React.FC = () => {
  return (
    <>
      <Profile />
      <Balance />
      <Transaction />
      <TransactionHistory />
    </>
  );
}

export default Dashboard;
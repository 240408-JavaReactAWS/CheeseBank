import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import Profile from '../components/Profile/Profile';
import Balance from '../components/Balance/Balance';
import Transaction from '../components/Transaction/Transaction';
import TransactionHistory from '../components/TransactionHistory/TransactionHistory';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { sessionUser } = useSession();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!sessionUser) {
      navigate('/');
    }
  }, [sessionUser, navigate]);

  return (
    <div className="dashboard">
      <div className="top">
        <Profile />
        <Balance />
      </div>
      <Transaction />
      <TransactionHistory />
    </div>
  );
};

export default Dashboard;
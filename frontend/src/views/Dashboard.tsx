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
        <div className="Profile">
          <Profile />
        </div>
        <div className="Balance">
          <Balance />
        </div>
      </div>
      <div className="Transaction">
        <Transaction />
      </div>
      <div className="TransactionHistory">
        <TransactionHistory />
      </div>
    </div>
  );
};

export default Dashboard;
// Dashboard.tsx
import React, { useEffect, useState } from 'react';
import Transaction from '../components/Transaction/Transaction';
import TransactionHistory from '../components/TransactionHistory/TransactionHistory';
import './Dashboard.css';
import axios from 'axios';

function Dashboard() {
    const [transactionsList, setTransactionsList] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Function to fetch user data and transaction history
        const fetchData = async () => {
            const currentUser = localStorage.getItem("username");
            try {
                const userResponse = await axios.get(`http://localhost:8080/api/users/username/${currentUser}`, {
                    withCredentials: true
                });
                setUser(userResponse.data);

                const transactionsResponse = await axios.get(`http://localhost:8080/api/transactions/history/${currentUser}`, {
                    withCredentials: true
                });
                setTransactionsList(transactionsResponse.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, []);

    const updateTransactionHistory = async () => {
        try {
            const currentUser = localStorage.getItem("username");
            const transactionsResponse = await axios.get(`http://localhost:8080/api/transactions/history/${currentUser}`, {
                withCredentials: true
            });
            setTransactionsList(transactionsResponse.data);
            
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className='dashboard-body'>
            <Transaction updateTransactionHistory={updateTransactionHistory} />
            <TransactionHistory updateTransactionHistory={function (): void {
        } }  />
        </div>
    );
}

export default Dashboard;

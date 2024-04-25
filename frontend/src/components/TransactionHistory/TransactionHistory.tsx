import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Transaction } from '../../models/Transaction';
import './TransactionHistory.css';


function TransactionHistory() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [userId, setUserId] = useState(0);

    useEffect(() => {
        // Simulating setting user ID from local storage
        // let userId = localStorage.getItem('userId');

         let userId = "1";
        if (userId) {
            setUserId(parseInt(userId));
        } else {    
            setUserId(0);
        }

const getAllTransactionHistory = async () => {
        try {
            let response = await axios.get(`http://localhost:8080/api/v1/history/transaction?userId=${userId}`);
            let data = response.data;
            console.log(data);
            setTransactions(data);
            setLoading(false);
        } catch (error) {
            setError(true);
            setLoading(false);
        }
    };

    getAllTransactionHistory();

    }, []); 


    return (
        <div className='transaction-history'>
            <h1>Transaction History</h1>
            {loading && <p>Loading...</p>}
            {error && <p>Error fetching data</p>}
            <table>
                <thead>
                    <tr>
                        <th>Transaction ID</th>
                        <th>Transaction Type</th>
                        <th>Transaction Amount</th>
                        <th>Description</th>
                        <th>Time Stamp</th>
                        <th>Current Balance</th>
                 
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction) => {
                        return (
                            <>
                            <tr key={transaction.id}>
                                <td>{transaction.id}</td>
                                <td>{transaction.type}</td>
                                <td>{transaction.transaction_amount}</td>
                                <td>{transaction.description}</td>
                                <td>{transaction.timeStamp.toString()}</td>
                                <td>{transaction.current_balance}</td>
                              
                            </tr></>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default TransactionHistory;

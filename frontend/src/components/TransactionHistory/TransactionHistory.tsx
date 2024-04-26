import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Transaction } from '../../models/Transaction';
import './TransactionHistory.css';
import { User } from '../../models/User';
import { set } from 'date-fns';

interface TransactionHistoryProps {
    user:User
}

function TransactionHistory(props: TransactionHistoryProps) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [user, setUser] = useState<User>();
    const [userId, setUserId] = useState(0);

    useEffect(() => {
    
        // let userId = localStorage.getItem('username');
        let username = "jDoe";

     const getAllTransactionHistory = async () => {
                setLoading(true);
               await axios.get(`http://localhost:8080/api/v1/history/transaction?username=${username}`)
                .then((response) => {
                let data = response.data;
                    setTransactions(data);
                    setUser(data[0].user);
                    setLoading(false);
                })
                .catch((error) =>{
                    setError(true);
                    setLoading(false);
                });

    };

    getAllTransactionHistory();

    }, []); 

 const downloadCSV = () => {
 
    const headers = Object.keys(transactions[0]).filter(key => key !== 'user');
    const csvContent =
        "data:text/csv;charset=utf-8," +
        headers.join(",") +
        "\n" +
        transactions.map(transaction =>
            headers.map(header => transaction[header]).join(",")
        ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
};




    return (
        <div className='transaction-history'>
            <h2>Transaction History</h2>
            <h4>Name: <span>{user?.first_name} {user?.last_name}</span> </h4>
      
            {loading && <p>Loading...</p>}
            {error && <p>Error fetching data</p>}
            <table>
                <thead>
                    <tr>
                        <th>Transaction ID</th>
                        <th>Transaction Type</th>
                        <th>Transaction Amount</th>
                        <th className='description'>Description</th>
                        <th>Date</th>
                        <th>Current Balance</th>
                 
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction) => {
                        return (
                          
                            <tr key={transaction.id}>
                                <td>{transaction.id}</td>
                                <td>{transaction.type}</td>
                                <td>{transaction.type === 'WITHDRAWAL' ? `(${transaction.transaction_amount})` : transaction.transaction_amount}</td>
                                <td>{transaction.description}</td>
                                <td>{new Date(transaction.timeStamp).toLocaleString()}</td>
                                <td>{transaction.current_balance}</td>
                              
                            </tr>
                        );
                    })}
                </tbody>
            </table>

                     <button className='download-btn' onClick={downloadCSV}>Download CSV</button>

        </div>
        
    );
}

export default TransactionHistory;

import React, { ChangeEvent, useEffect, useState } from 'react';
import axios from 'axios';
import { Transaction } from '../../models/Transaction';
import './TransactionHistory.css';
import { useSession } from '../../context/SessionContext';

interface ResponseData {
    content: Transaction[];
}

function TransactionHistory() {
    const { sessionUser } = useSession();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        const getAllTransactionHistory = async () => {
            setLoading(true);
            try {
                const response = await axios.get<ResponseData>(`${process.env.REACT_APP_BACKEND_URL}/api/transactions/history`, {
                    withCredentials: true
                });
                console.log(response.data.content);
                console.log(Array.isArray(response.data.content));
                setTransactions(response.data.content);
                setFilteredTransactions(response.data.content);
            } catch (error) {
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        if (sessionUser) {
            getAllTransactionHistory();
        }
    }, [sessionUser]);

    const search = (searchText: string) => {
        const filtered = transactions.filter(transaction => {
            const description = transaction.description?.toLowerCase() ?? '';
            const type = transaction.transactionType.toLowerCase();
            return description.includes(searchText.toLowerCase()) || type.includes(searchText.toLowerCase());
        });
        setFilteredTransactions(filtered);
    };

    const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const searchValue = e.target.value;
        setSearchText(searchValue);
        search(searchValue);
    };

    if (!sessionUser) {
        return <div>Please log in to view this page.</div>;
    }

    return (
        <div className='transaction-history'>
            <h2>Transaction History</h2>
            <input
                className='search-bar'
                type="text"
                value={searchText}
                onChange={handleSearchInputChange}
                placeholder="Search..."
            />

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
                    {filteredTransactions.map((transaction) => (
                        <tr key={transaction.id}>
                            <td>{transaction.id}</td>
                            <td>{transaction.transactionType}</td>
                            <td>{transaction.transactionType === 'WITHDRAWAL' ? `(${transaction.amount})` : transaction.amount}</td>
                            <td>{transaction.description}</td>
                            <td>{new Date(transaction.timeStamp).toLocaleString()}</td>
                            <td>{transaction.resultBalance}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TransactionHistory;

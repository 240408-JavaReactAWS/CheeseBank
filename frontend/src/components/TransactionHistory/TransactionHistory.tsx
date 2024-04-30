import React, { ChangeEvent, useEffect, useState } from 'react';
import axios from 'axios';
import './TransactionHistory.css';
import { User } from '../../models/User';
import { ITransaction } from '../../models/ITransaction';

interface TransactionHistoryProps {
    updateTransactionHistory: () => void; 
}

function TransactionHistory(props: TransactionHistoryProps) {
    const [transactions, setTransactions] = useState<ITransaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [user, setUser] = useState<User>();
    const [searchText, setSearchText] = useState('');
    const [filteredTransactions, setFilteredTransactions] = useState<ITransaction[]>([]);
    const [currentPage, setCurrentPage] = useState(1); 
    const transactionsPerPage = 10; 

    useEffect(() => {
        const username = localStorage.getItem('username');

        const getAllTransactionHistory = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:8080/api/transactions/history/${username}`, {
                    withCredentials: true
                });
                const data = response.data;
                        console.log(data)
                setTransactions(data);
                setFilteredTransactions(data);
                setUser(data[0]?.user);
                setLoading(false);
            } catch (error) {
                setError(true);
                setLoading(false);
            }
        };

        getAllTransactionHistory();
    }, [props.updateTransactionHistory]);

    const search = (searchText: string) => {
        const filteredTransactions = transactions.filter(transaction => {
            const description = transaction.description ? transaction.description.toLowerCase() : '';
            const type = transaction.transactionType ? transaction.transactionType.toLowerCase() : '';

            return description.includes(searchText.toLowerCase()) ||
                   type.includes(searchText.toLowerCase());
        });

        setFilteredTransactions(filteredTransactions);
    };

    const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const searchValue = e.target.value;
        setSearchText(searchValue);
        search(searchValue);
    };

    const handleNextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    const handlePreviousPage = () => {
        setCurrentPage(currentPage - 1);
    };

    

    const indexOfLastTransaction = currentPage * transactionsPerPage;
    const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
    const currentTransactions = filteredTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

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
            <h4>Name: <span>{user?.first_name} {user?.last_name}</span></h4>
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
                        <th>Balance</th>
                    </tr>
                </thead>
                <tbody>
                    {currentTransactions.map((transaction) => (
                        <tr key={transaction.id}>
                            <td>{transaction.id}</td>
                            <td>{transaction.transactionType}</td>
                            <td>{transaction.transactionType === 'WITHDRAWAL' ? `(${transaction.amount})` : transaction.amount}</td>
                            <td>{transaction.description}</td>
                            <td>{new Date(transaction.timeStamp).toLocaleString()}</td>
                            <td>{transaction.curentBalance}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {filteredTransactions.length > transactionsPerPage && (
                <div>
                    <button className='mr-5 p-button mt-2 rounded btn btn-secondary' onClick={handlePreviousPage} disabled={currentPage === 1}>
                        Previous
                    </button>
                    <button  className='ml-5 mt-2 rounded btn btn-secondary' onClick={handleNextPage} disabled={indexOfLastTransaction >= filteredTransactions.length}>
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}

export default TransactionHistory;
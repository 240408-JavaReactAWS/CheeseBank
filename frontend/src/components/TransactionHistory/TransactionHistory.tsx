import React, { ChangeEvent, useEffect, useState } from 'react';
import axios from 'axios';
import { Transaction } from '../../models/Transaction';
import { useSession } from '../../context/SessionContext';
import { Container, Table, Form, Button } from 'react-bootstrap';

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
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
      const getAllTransactionHistory = async () => {
        setLoading(true);
        try {
          const response = await axios.get<ResponseData>(`${process.env.REACT_APP_BACKEND_URL}/api/transactions/history`, {
              withCredentials: true
          });
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

  const transactionsToDisplay = showAll ? filteredTransactions : filteredTransactions.slice(0, 5);

  return (
    <Container>
      <h2>Transaction History</h2>
      <Form.Control
        type="text"
        value={searchText}
        onChange={handleSearchInputChange}
        placeholder="Search..."
      />

      {loading && <p>Loading...</p>}
      {error && <p>Error fetching data</p>}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Transaction Type</th>
            <th>Transaction Amount</th>
            <th>Description</th>
            <th>Date</th>
            <th>Current Balance</th>
          </tr>
        </thead>
        <tbody>
          {transactionsToDisplay.map((transaction) => (
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
      </Table>
      <Button onClick={() => setShowAll(!showAll)}>
        {showAll ? 'Show Less' : 'View All Transactions'}
      </Button>
    </Container>
  );
}

export default TransactionHistory;
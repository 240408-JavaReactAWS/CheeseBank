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
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 5;

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

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const transactionsToDisplay = filteredTransactions.slice((currentPage - 1) * transactionsPerPage, currentPage * transactionsPerPage);

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
            <th>Date</th>
            <th>Transaction Type</th>
            <th>Description</th>
            <th>Transaction Amount</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {transactionsToDisplay.map((transaction) => (
            <tr key={transaction.id}>
              <td>{new Date(transaction.timeStamp).toLocaleString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}</td>
              <td>{transaction.transactionType}</td>
              <td>{transaction.description}</td>
              <td>{transaction.transactionType === 'WITHDRAWAL' ? `(${transaction.amount})` : transaction.amount}</td>
              <td>{transaction.resultBalance}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
        &lt;
      </Button>
      <span>{currentPage}</span>
      <Button onClick={() => paginate(currentPage + 1)} disabled={currentPage === Math.ceil(filteredTransactions.length / transactionsPerPage)}>
        &gt;
      </Button>
    </Container>
  );
}

export default TransactionHistory;
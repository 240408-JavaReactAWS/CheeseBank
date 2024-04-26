import React from 'react';
import './App.css';
import Header from './components/Header/Header.tsx';
import TransactionHistory from './components/TransactionHistory/TransactionHistory.tsx';
import Transaction from './components/Transaction/Transaction.tsx';

function App() {
  return (
    <>
      <Header />
      <TransactionHistory></TransactionHistory>
      <Transaction></Transaction>
    </>
  );
}

export default App;
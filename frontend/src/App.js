import React from 'react';
import './App.css';
import Header from './components/Header/Header.tsx';
import TransactionHistory from './components/TransactionHistory/TransactionHistory.tsx';

function App() {
  return (
    <>
      <Header />
      <TransactionHistory></TransactionHistory>
    </>
  );
}

export default App;
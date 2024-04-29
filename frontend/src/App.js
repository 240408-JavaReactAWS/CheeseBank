import React from 'react';
import './App.css';
import Header from './components/Header/Header.tsx';
import TransactionHistory from './components/TransactionHistory/TransactionHistory.tsx';
import Transaction from './components/Transaction/Transaction.tsx';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { R } from '@angular/cdk/keycodes';
import ResetPassword from './components/reset-password/ResetPassword.tsx';
import ForgotPassword from './components/forgot-password/ForgotPassword.tsx';

function App() {
  return (
    <>
      <Header />
      {/* <TransactionHistory></TransactionHistory>
      <Transaction></Transaction> */}

      <BrowserRouter>
        <Routes>
          <Route path="transaction-history" element={<TransactionHistory />} />
          <Route path="transaction" element={<Transaction />} />
          <Route path="reset-password" element={<ResetPassword />} />
           <Route path="forgot-password" element={<ForgotPassword />} />
        </Routes>
      </BrowserRouter>

    </>
  );
}

export default App;
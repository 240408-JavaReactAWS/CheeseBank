import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Navbar from './components/Navbar/Navbar';
import Dashboard from './views/Dashboard';
import AdminDashboard from './views/AdminDashboard';
import Home from './views/Home';
import Transaction from './components/Transaction/Transaction';
import Login from './components/Login/Login';


function App() {
  return (
    <>
    <Header />
    <Navbar />
    <Login/>
    
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transaction" element={<Transaction />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
    </Routes>
    <Footer />
    </>
  );
}

export default App;
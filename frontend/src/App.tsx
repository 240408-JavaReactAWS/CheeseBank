import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Navbar from './components/Navbar/Navbar';
import Dashboard from './views/Dashboard';
import AdminDashboard from './views/AdminDashboard';
import Home from './views/Home';
import ResetPassword from './components/ResetPassword/ResetPassword';

const App: React.FC = () => {
  return (
    <>
    <Header />
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
    </Routes>
    <Footer />
    </>
  );
}

export default App;
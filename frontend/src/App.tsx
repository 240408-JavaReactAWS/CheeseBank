import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Navbar from './components/Navbar/Navbar';
import LandingPage from './views/Login';
import Dashboard from './views/Dashboard';
import AdminDashboard from './views/AdminDashboard';

function App() {
  return (
    <Header />
    <Navbar />
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
    </Routes>
    <Footer />
  );
}

export default App;
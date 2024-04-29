import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import LandingPage from './views/Login';
import Dashboard from './views/Dashboard';
import AdminDashboard from './views/AdminDashboard';
import { AuthContext } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';

function App() {
  const { user, login, logout, setUser } = useAuth();
  return (
    <AuthContext.Provider value={{ user,setUser }}>
      <Header />
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
      <Footer />
    </AuthContext.Provider>
  );
}

export default App;
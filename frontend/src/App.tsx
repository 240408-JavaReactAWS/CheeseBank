import React from 'react';
import { SessionProvider } from './context/SessionContext';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import NavigationBar from './components/NavigationBar/NavigationBar';
import ResetPassword from './components/ResetPassword/ResetPassword';
import AboutUs from './components/AboutUs/AboutUs';
import Locations from './components/Locations/Locations';
import Home from './views/Home';
import Dashboard from './views/Dashboard';
import AdminDashboard from './views/AdminDashboard';
import 'bootstrap/dist/css/bootstrap.min.css';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';

const App: React.FC = () => {
  return (
    <>
      <SessionProvider>
        <Header />
        <NavigationBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/AdminDashboard" element={<AdminDashboard />} />
          <Route path="/AboutUs" element={<AboutUs />} />
          <Route path="/Locations" element={<Locations />} />
        </Routes>
        <Footer />
      </SessionProvider>
    </>
  );
}

export default App;
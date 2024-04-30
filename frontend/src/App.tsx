import React from 'react';
import { Routes, Route, Router, BrowserRouter } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Navbar from './components/Navbar/Navbar';
import ResetPassword from './components/ResetPassword/ResetPassword';
import Dashboard from './views/Dashboard';
import AdminDashboard from './views/AdminDashboard';
import Home from './views/Home';
import 'bootstrap/dist/css/bootstrap.min.css';
import AboutUs from './components/AboutUs/AboutUs';
import Locations from './components/Locations/Locations';

const App: React.FC = () => {
  return (
    
    <>
      <Header />

      {/* <BrowserRouter>  */}
      <Navbar />

      <div className="body-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/AboutUs" element={<AboutUs />} />
          <Route path="/Locations" element={<Locations />} />
        </Routes>
      </div>
      {/* </BrowserRouter> */}
      
      <Footer />
    </>
    
  );
}

export default App;
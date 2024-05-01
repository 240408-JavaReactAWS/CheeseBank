import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { SessionProvider } from './context/SessionContext';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Navbar from './components/Navbar/Navbar';
import Home from './views/Home';
import Dashboard from './views/Dashboard';
import AdminDashboard from './views/AdminDashboard';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/Login/Login';
import AboutUs from './components/AboutUs/AboutUs';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import Register from './components/Register/Register';
import ResetPassword from './components/reset-password/ResetPassword';
import Profile from './components/Profile/Profile';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const loggedInUser = localStorage.getItem('isLoggedIn');
    return loggedInUser === 'true';
  });

  const location = useLocation();

  useEffect(() => {
    setIsLoggedIn(prevIsLoggedIn => {
      const loggedInUser = localStorage.getItem('isLoggedIn');
      const newIsLoggedIn = loggedInUser === 'true';
      // Reload the page if the login status changes and the user is not on the login page
      if (prevIsLoggedIn !== newIsLoggedIn && location.pathname !== '/login') {
        window.location.reload();
      }
      return newIsLoggedIn;
    });
  }, [location.pathname]);

  return ( 
    <>
      <Header />
      {isLoggedIn && <Navbar />}
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/aboutUs' element={<AboutUs />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/register' element={<Register />} />
        <Route path='/profile' element={<Profile />} />
      </Routes>
      <Footer/>
    </>
  );
}

export default App;

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { SessionProvider } from './context/SessionContext';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Navbar from './components/Navbar/Navbar';
import ResetPassword from './components/ResetPassword/ResetPassword';
import Home from './views/Home';
import Dashboard from './views/Dashboard';
import AdminDashboard from './views/AdminDashboard';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/Login/Login';

const App: React.FC = () => {
  return ( 
    <>
      <Header />
      <Navbar />

      <Routes>
           <Route path='/login' element={<Login />}></Route>
            <Route path='/dashboard' element={<Dashboard />}></Route>
           
      </Routes>

    <Footer/>
    

    </>
  );
}

export default App;
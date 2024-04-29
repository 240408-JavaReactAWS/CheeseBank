import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; // Assuming global styles are imported here
import App from './App';
import { BrowserRouter } from 'react-router-dom';
// import { AuthContextProvider } from './context/AuthContext';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      {/* <AuthContextProvider> */}
        <App />
      {/* </AuthContextProvider> */}
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
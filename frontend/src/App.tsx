import React from 'react';
import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path='/' element={<COMPONENT />}></Route>
        <Route path='/' element={<COMPONENT />}></Route>
        <Route path='/' element={<COMPONENT />}></Route> */}
        <Route path='*' element={<h1>404 Not Found</h1>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const App: React.FC = () => {
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* <Route path = "/" component = {}></Route>
          <Route path = "/login" component = {}></Route>
          <Route path = "/register" component = {}></Route>
          <Route path = "/reset" component = {}></Route>
          <Route path = "/dashboard" component = {}></Route>
          <Route path = "/history" component = {}></Route>
          <Route path = "/admin" component = {}></Route> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login.jsx';
import AthletePanel from './components/AthletePanel.jsx';
import AdminPanel from './components/AdminPanel.jsx';
import './styles/App.css';

function App() {
  const checkAuth = () => {
    const token = localStorage.getItem('token');
    return token !== null;
  };

  const checkRole = (role) => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    const userRole = JSON.parse(atob(token.split('.')[1])).role;
    return userRole === role;
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/athlete" element={checkAuth() && checkRole('athlete') ? <AthletePanel /> : <Login />} />
          <Route path="/admin" element={checkAuth() && checkRole('admin') ? <AdminPanel /> : <Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

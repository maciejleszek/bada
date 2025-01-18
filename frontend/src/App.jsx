import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import AthletePanel from './components/AthletePanel';
import AdminPanel from './components/AdminPanel';
import './styles/App.css';

function App() {
  const ProtectedRoute = ({ children, allowedRole }) => {
    const token = localStorage.getItem('token');
    if (!token) return <Navigate to="/" replace />;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.role !== allowedRole) {
        return <Navigate to="/" replace />;
      }
      return children;
    } catch (error) {
      localStorage.removeItem('token');
      return <Navigate to="/" replace />;
    }
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/athlete"
            element={
              <ProtectedRoute allowedRole="athlete">
                <AthletePanel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminPanel />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App
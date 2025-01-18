import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AthletePanel = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div>
      <h2>Welcome, Athlete!</h2>
      
      <button onClick={handleLogout} className="logout-button">Logout</button>

    </div>
  );
};

export default AthletePanel;

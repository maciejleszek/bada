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
      <h2>Panel Atlety!</h2>
      
      <button onClick={handleLogout} className="logout-button">Wyloguj</button>

    </div>
  );
};

export default AthletePanel;

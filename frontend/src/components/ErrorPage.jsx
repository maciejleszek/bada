import React from 'react';
import { useNavigate } from 'react-router-dom';

export const ErrorPage = ({ status, message }) => {
  const navigate = useNavigate();

  return (
    <div className="error-container">
      <h1 className="error-title">Error {status}</h1>
      <p className="error-message">{message}</p>
      <button 
        className="primary-button"
        onClick={() => navigate('/')}
      >
        Return to Home
      </button>
    </div>
  );
};
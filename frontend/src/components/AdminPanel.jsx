import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUsers, fetchEvents } from '../api/api';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [usersData, eventsData] = await Promise.all([
          fetchUsers(),
          fetchEvents()
        ]);
        setUsers(usersData);
        setEvents(eventsData);
        setLoading(false);
      } catch (err) {
        console.error('Error:', err);
        if (err.message.includes('token')) {
          localStorage.removeItem('token');
          navigate('/');
        } else {
          setError('Failed to load data. Please try again later.');
        }
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-panel">
      <div className="header">
        <h2>Panel administratora</h2>
        <button onClick={handleLogout} className="logout-button">Wyloguj</button>
      </div>
      
      <section className="users-section">
        <h3>Członkowie</h3>
        {users.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Imię i nazwisko</th>
                <th>Email</th>
                <th>Rola</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name} {user.surname}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No users found.</p>
        )}
      </section>

      <section className="events-section">
        <h3>Wydarzenia</h3>
        {events.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Nazwa</th>
                <th>Data</th>
                <th>Lokalizacja</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id}>
                  <td>{event.name}</td>
                  <td>{new Date(event.date).toLocaleDateString()}</td>
                  <td>{event.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No events found.</p>
        )}
      </section>
    </div>
  );
};

export default AdminPanel;
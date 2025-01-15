import React, { useEffect, useState } from 'react';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const usersResponse = await fetch('http://127.0.0.1:5000/api/users', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          const eventsResponse = await fetch('http://127.0.0.1:5000/api/events', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (usersResponse.ok && eventsResponse.ok) {
            const usersData = await usersResponse.json();
            const eventsData = await eventsResponse.json();
            setUsers(usersData);
            setEvents(eventsData);
          } else {
            console.error('Failed to fetch admin data');
          }
        } catch (error) {
          console.error('Error fetching admin data:', error);
        }
      }
    };

    fetchAdminData();
  }, []);

  return (
    <div>
      <h2>Admin Panel</h2>
      {loading ? (
        <p>Loading admin data...</p>
      ) : (
        <div>
          <h3>Users</h3>
          <div className="model-section">
            {users.length > 0 ? (
              <ul>
                {users.map((user) => (
                  <li key={user.id}>
                    <strong>{user.name}</strong> - {user.email} - {user.role}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No users found.</p>
            )}
          </div>

          <h3>Events</h3>
          <div className="model-section">
            {events.length > 0 ? (
              <ul>
                {events.map((event) => (
                  <li key={event.id}>
                    <strong>{event.name}</strong> - {event.date} - {event.location}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No events found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;

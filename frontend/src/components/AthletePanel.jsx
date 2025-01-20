import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchEvents, fetchUserResults } from '../api/api';
import DataTable from './DataTable';
import ProfileForm from './ProfileForm';
import ResultForm from './ResultForm';
import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import { Button } from '@mui/material';
import { PlusCircle, User, LogOut } from 'lucide-react';
import { Toast } from './Toast';

const AthletePanel = () => {
  const [results, setResults] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showResultForm, setShowResultForm] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();
  const userId = JSON.parse(atob(localStorage.getItem('token').split('.')[1])).id;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [resultsData, eventsData] = await Promise.all([
        fetchUserResults(userId), // Uncomment this when implemented
        fetchEvents(),
      ]);
      console.log('Events Data:', eventsData); // Debug
      setResults(resultsData || []);
      setEvents(eventsData || []);
      setLoading(false);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load data. Please try again later.');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const resultColumns = [
    {
      key: 'event_id',
      label: 'Wydarzenie',
      render: (row) => {
        const event = events?.find((e) => e.id === row.event_id);
        return event ? event.name : 'Unknown';
      },
    },
    {
      key: 'date',
      label: 'Data',
      render: (row) => {
        const event = events?.find((e) => e.id === row.event_id);
        return event ? new Date(event.date).toLocaleDateString() : 'Unknown';
      },
    },
    { key: 'result', label: 'Wynik' },
  ];

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (error) return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Panel Zawodnika</h2>
        <div className="flex gap-2">
          <Button onClick={() => setShowProfileForm(true)} variant="outline" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Edytuj profil
          </Button>
          <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Wyloguj
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <Typography>Moje wyniki</Typography>
              <Button onClick={() => setShowResultForm(true)} className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Dodaj wynik
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable data={results} columns={resultColumns} title="Historia wyników" />
          </CardContent>
        </Card>
      </div>

      {showProfileForm && (
        <ProfileForm
          user={null} // Fetch current user data
          onSubmit={async (data) => {
            // Handle profile update
            showToast('Zapisano zmiany pomyślnie');
            setShowProfileForm(false);
            loadData();
          }}
          isAdmin={false}
        />
      )}

      {showResultForm && (
        <ResultForm
          events={events}
          onSubmit={async (data) => {
            // Handle result create
            showToast('Dodano wynik pomyślnie');
            setShowResultForm(false);
            loadData();
          }}
          isAdmin={false}
        />
      )}

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
};

export default AthletePanel;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  fetchEvents, 
  fetchUserResults, 
  fetchCurrentUser, 
  fetchDisciplines,
  updateUserProfile,
  createResult
} from '../api/api';
import DataTable from './DataTable';
import ProfileForm from './ProfileForm';
import ResultForm from './ResultForm';
import { Tabs, Tab, Box } from '@mui/material';
import { Button } from '@mui/material';
import { PlusCircle, User, LogOut } from 'lucide-react';
import { Toast } from './Toast';

const AthletePanel = () => {
  const [results, setResults] = useState([]);
  const [events, setEvents] = useState([]);
  const [disciplines, setDisciplines] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
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
      const [resultsData, eventsData, disciplinesData, userData] = await Promise.all([
        fetchUserResults(userId),
        fetchEvents(),
        fetchDisciplines(),
        fetchCurrentUser()
      ]);

      setResults(resultsData || []);
      setEvents(eventsData || []);
      setDisciplines(disciplinesData || []);
      setCurrentUser(userData);
      setLoading(false);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load data. Please try again later.');
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (data) => {
    try {
      await updateUserProfile(data, userId);
      showToast('Profil został zaktualizowany', 'success');
      setShowProfileForm(false);
      loadData();
    } catch (err) {
      throw new Error(err.message || 'Failed to update profile');
    }
  };

  const handleResultCreate = async (data) => {
    try {
      const resultData = {
        ...data,
        athlete_id: userId
      };
      await createResult(resultData);
      showToast('Wynik został dodany', 'success');
      setShowResultForm(false);
      loadData();
    } catch (err) {
      throw new Error(err.message || 'Failed to add result');
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
    { key: 'discipline_id', label: 'Dyscyplina',
      render: (row) => {
        const discipline = disciplines?.find((d) => d.id === row.discipline_id);
        return discipline ? discipline.name : 'Unknown';
      },
    },
  ];

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (error) return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Panel Zawodnika</h2>
        {currentUser && (
          <h1 className="text-3xl font-semibold">
            {currentUser.name} {currentUser.surname}
          </h1>
        )}
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
            <div className="flex justify-between items-center">
            <h3 className="text-1xl font-bold">Moje wyniki</h3>

              <Button onClick={() => setShowResultForm(true)} className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Dodaj wynik
              </Button>
            </div>
            <DataTable data={results} columns={resultColumns} title="Historia wyników" />
      </div>

      {showProfileForm && (
        <ProfileForm
          user={currentUser}
          onSubmit={handleProfileUpdate}
          isAdmin={false}
        />
      )}

      {showResultForm && (
        <ResultForm
          events={events}
          disciplines={disciplines}
          onSubmit={handleResultCreate}
          isAdmin={false}
        />
      )}

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
};

export default AthletePanel;

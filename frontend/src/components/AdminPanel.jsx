import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUsers, fetchEvents } from '../api/api';
import DataTable from './DataTable';
import ProfileForm from './ProfileForm';
import ResultForm from './ResultForm';
import ConfirmDialog from './ConfirmDialog';
import { Tabs, Tab, Box } from '@mui/material';
import { Button } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { PlusCircle, Edit, Trash2, LogOut } from 'lucide-react';
import { Toast } from './Toast';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showResultForm, setShowResultForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [deleteAction, setDeleteAction] = useState(null);
  const [toast, setToast] = useState(null);
  const [currentTab, setCurrentTab] = React.useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [usersData, eventsData, resultsData] = await Promise.all([
        fetchUsers(),
        fetchEvents(),
      ]);
      setUsers(usersData);
      setEvents(eventsData);
      setResults(resultsData);
      setLoading(false);
    } catch (err) {
      console.error('Error:', err);
      if (err.message.includes('token')) {
        handleLogout();
      } else {
        setError('Failed to load data. Please try again later.');
      }
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleDelete = (type, item) => {
    setSelectedItem(item);
    setDeleteAction(type);
    setShowConfirmDialog(true);
  };

  const handleEdit = (type, item) => {
    setSelectedItem(item);
    if (type === 'user') {
      setShowProfileForm(true);
    } else if (type === 'result') {
      setShowResultForm(true);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const userColumns = [
    { key: 'name', label: 'Imię' },
    { key: 'surname', label: 'Nazwisko' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Rola' }
  ];

  const eventColumns = [
    { key: 'name', label: 'Nazwa' },
    { 
      key: 'date', 
      label: 'Data',
      render: (row) => new Date(row.date).toLocaleDateString()
    },
    { key: 'location', label: 'Lokalizacja' }
  ];

  const resultColumns = [
    { 
      key: 'athlete_id', 
      label: 'Zawodnik',
      render: (row) => {
        const user = users.find(u => u.id === row.athlete_id);
        return user ? `${user.name} ${user.surname}` : 'Unknown';
      }
    },
    {
      key: 'event_id',
      label: 'Wydarzenie',
      render: (row) => {
        const event = events.find(e => e.id === row.event_id);
        return event ? event.name : 'Unknown';
      }
    },
    { key: 'result', label: 'Wynik' }
  ];

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (error) return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Panel Administratora</h2>
        <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
          <LogOut className="h-4 w-4" />
          Wyloguj
        </Button>
      </div>

      <Box sx={{ width: '100%' }}>
      {/* Zakładki */}
      <Tabs
        value={currentTab}
        onChange={(e, newValue) => setCurrentTab(newValue)}
        sx={{ marginBottom: 4 }}
      >
        <Tab label="Użytkownicy" />
        <Tab label="Wydarzenia" />
        <Tab label="Wyniki" />
      </Tabs>

      {/* Panel użytkowników */}
      {currentTab === 0 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 2 }}>
            <Button
              onClick={() => handleEdit('user', null)}
              startIcon={<AddCircleOutlineIcon />}
              variant="contained"
              color="primary"
            >
              Dodaj użytkownika
            </Button>
          </Box>
          <DataTable
            data={users}
            columns={userColumns}
            title="Lista użytkowników"
            actions={(row) => (
              <>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleEdit('user', row)}
                  startIcon={<EditIcon />}
                >
                  Edytuj
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={() => handleDelete('user', row)}
                  startIcon={<DeleteIcon />}
                >
                  Usuń
                </Button>
              </>
            )}
          />
        </Box>
      )}

      {/* Panel wydarzeń */}
      {currentTab === 1 && (
        <Box>
          <DataTable data={events} columns={eventColumns} title="Lista wydarzeń" />
        </Box>
      )}

      {/* Panel wyników */}
      {/* {currentTab === 2 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 2 }}>
            <Button
              onClick={() => handleEdit('result', null)}
              startIcon={<AddCircleOutlineIcon />}
              variant="contained"
              color="primary"
            >
              Dodaj wynik
            </Button>
          </Box>
          <DataTable
            data={results}
            columns={resultColumns}
            title="Lista wyników"
            actions={(row) => (
              <>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleEdit('result', row)}
                  startIcon={<EditIcon />}
                >
                  Edytuj
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={() => handleDelete('result', row)}
                  startIcon={<DeleteIcon />}
                >
                  Usuń
                </Button>
              </>
            )}
          />
        </Box>
      )} */}
    </Box>

      {showProfileForm && (
        <ProfileForm
          user={selectedItem}
          onSubmit={async (data) => {
            // Handle user update/create
            showToast('Zapisano zmiany pomyślnie');
            setShowProfileForm(false);
            loadData();
          }}
          isAdmin={true}
        />
      )}

      {showResultForm && (
        <ResultForm
          result={selectedItem}
          events={events}
          onSubmit={async (data) => {
            // Handle result update/create
            showToast('Zapisano wynik pomyślnie');
            setShowResultForm(false);
            loadData();
          }}
          isAdmin={true}
        />
      )}

      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={async () => {
          // Handle delete action
          showToast('Usunięto pomyślnie');
          setShowConfirmDialog(false);
          loadData();
        }}
        title="Potwierdź usunięcie"
        description="Czy na pewno chcesz usunąć ten element? Tej operacji nie można cofnąć."
      />

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
};

export default AdminPanel;
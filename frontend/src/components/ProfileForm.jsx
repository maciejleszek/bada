import React, { useState } from 'react';
import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import { AlertCircle, Save } from 'lucide-react';
import { Alert, AlertTitle } from '@mui/material';

const ProfileForm = ({ user, onSubmit, isAdmin }) => {
  const [formData, setFormData] = useState({
    id: user?.id || null,
    name: user?.name || '',
    surname: user?.surname || '',
    email: user?.email || '',
    role: user?.role || 'athlete',
    password: '' // Dodane pole hasła dla nowych użytkowników
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <Typography>{user ? 'Edytuj Profil' : 'Dodaj Nowego Użytkownika'}</Typography>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{error}</AlertTitle>
            </Alert>
          )}
          
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Imię
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="surname" className="text-sm font-medium">
              Nazwisko
            </label>
            <input
              type="text"
              id="surname"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          {isAdmin && (
            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium">
                Rola
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="athlete">Atleta</option>
                <option value="admin">Administrator</option>
                <option value="coach">Trener</option>
              </select>
            </div>
          )}
          
          {!user && ( // Pokazuj pole hasła tylko dla nowych użytkowników
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Hasło
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-primary text-white p-2 rounded-md hover:bg-primary/90"
          >
            <Save className="h-4 w-4" />
            {user ? 'Zapisz zmiany' : 'Dodaj użytkownika'}
          </button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;
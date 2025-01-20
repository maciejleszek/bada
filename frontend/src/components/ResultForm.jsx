import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import { AlertCircle, Save } from 'lucide-react';
import { Alert, AlertTitle } from '@mui/material';

const ResultForm = ({ result, events, disciplines, users, onSubmit, isAdmin }) => {
  const [formData, setFormData] = useState({
    athlete_id: result?.athlete_id || '',
    event_id: result?.event_id || '',
    discipline_id: result?.discipline_id || '',
    result: result?.result || ''
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
      setError(err.message || 'Failed to save result');
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <Typography>{result ? 'Edytuj Wynik' : 'Dodaj Nowy Wynik'}</Typography>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{error}</AlertTitle>
            </Alert>
          )}
          {isAdmin && ( 
            <div className="space-y-2">
              <label htmlFor="athlete_id" className="text-sm font-medium">
                Zawodnik
              </label>
                <select 
                    id="athlete_id"
                    name="athlete_id"
                    value={formData.athlete_id}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                    required
                >
                    <option value="">Wybierz zawodnika</option>
                    {users?.map(user => (
                        <option key={user.id} value={user.id}>
                            {user.name} {user.surname}
                        </option>
                    ))}
                </select>
              
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="event_id" className="text-sm font-medium">
              Wydarzenie
            </label>
            <select
              id="event_id"
              name="event_id"
              value={formData.event_id}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Wybierz wydarzenie</option>
              {events?.map(event => (
                <option key={event.id} value={event.id}>
                  {event.name} - {new Date(event.date).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="discipline_id" className="text-sm font-medium">
              Dyscyplina
            </label>
            <select
              id="discipline_id"
              name="discipline_id"
              value={formData.discipline_id}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Wybierz dyscyplinę</option>
              {disciplines?.map(discipline => (
                <option key={discipline.id} value={discipline.id}>
                  {discipline.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="result" className="text-sm font-medium">
              Wynik
            </label>
            <input
              type="text"
              id="result"
              name="result"
              value={formData.result}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
              placeholder="np. 10.5 s"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-primary text-white p-2 rounded-md hover:bg-primary/90"
          >
            <Save className="h-4 w-4" />
            {result ? 'Zaktualizuj wynik' : 'Dodaj wynik'}
          </button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ResultForm;
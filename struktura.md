# Struktura projektu

# Backend (Flask)
# sports_club_backend/
# |-- app.py               # Główna aplikacja Flask
# |-- config.py            # Konfiguracja bazy danych i aplikacji
# |-- models.py            # Modele ORM (SQLAlchemy)
# |-- routes/
#     |-- __init__.py      # Inicjalizacja blueprintów
#     |-- users.py         # Endpointy użytkowników
#     |-- events.py        # Endpointy wydarzeń
#     |-- results.py       # Endpointy wyników
# |-- database_setup.py    # Skrypt do inicjalizacji bazy danych
# |-- requirements.txt     # Wymagane biblioteki Python

# Frontend (React)
# sports_club_frontend/
# |-- public/
#     |-- index.html       # Główny plik HTML
# |-- src/
#     |-- App.js           # Główna aplikacja React
#     |-- index.js         # Punkt wejściowy React
#     |-- components/
#         |-- Login.js     # Komponent logowania
#         |-- AthletePanel.js # Panel zawodnika
#         |-- AdminPanel.js   # Panel administratora
#     |-- api/
#         |-- api.js       # Obsługa komunikacji z backendem
#     |-- styles/
#         |-- App.css      # Główne style aplikacji

# database_setup.py - Skrypt do inicjalizacji bazy danych
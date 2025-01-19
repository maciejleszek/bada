# Struktura projektu

# Backend (Flask)
# backend/
# |-- instance/
#     |-- sports_club.db
# |-- app.py               # Główna aplikacja Flask
# |-- auth.py              # Autoryzacja z tokenami JWT
# |-- config.py            # Konfiguracja bazy danych i aplikacji
# |-- models.py            # Modele ORM (SQLAlchemy)
# |-- routes/
#     |-- __init__.py      # Inicjalizacja blueprintów
#     |-- users.py         # Endpointy użytkowników
#     |-- events.py        # Endpointy wydarzeń
#     |-- results.py       # Endpointy wyników
# |-- populate_database.py    # Skrypt do inicjalizacji bazy danych
# |-- requirements.txt     # Wymagane biblioteki Python

# Frontend (React)
# frontend/
# |index.html       # Główny plik HTML
# |-- src/
#     |-- App.jsx          # Główna aplikacja React
#     |-- main.jsx         # Punkt wejściowy React
#     |-- components/
#         |-- Login.jsx     # Komponent logowania
#         |-- AthletePanel.jsx # Panel zawodnika
#         |-- AdminPanel.jsx   # Panel administratora
#         |-- ErrorPage.jsx   # Panel administratora
#         |-- FormValidator.jsx   # Panel administratora
#         |-- Toast.jsx   # Panel administratora
#     |-- api/
#         |-- api.js       # Obsługa komunikacji z backendem
#     |-- styles/
#         |-- App.css      # Główne style aplikacji
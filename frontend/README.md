# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh


# |-- app.py               # Główna aplikacja Flask
# |-- config.py            # Konfiguracja bazy danych i aplikacji
# |-- models.py            # Modele ORM (SQLAlchemy)
# |-- routes/
#     |-- __init__.py      # Inicjalizacja blueprintów
#     |-- users.py         # Endpointy użytkowników
#     |-- events.py        # Endpointy wydarzeń
#     |-- results.py       # Endpointy wyników
# |-- populate_database.py    # Skrypt do inicjalizacji bazy danych
# |-- requirements.txt 
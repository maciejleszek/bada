from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from config import config
# Importowanie modeli (zależne od db)
from models import db, User, Event, Result, Discipline

# Importowanie i rejestracja blueprintów
from routes.users import users_bp
from routes.events import events_bp
from routes.results import results_bp

# Inicjalizacja aplikacji Flask
app = Flask(__name__)
app.config.from_object(config['development'])

# Inicjalizacja bazy danych
db.init_app(app)
migrate = Migrate(app, db)

app.register_blueprint(users_bp, url_prefix='/api/users')
app.register_blueprint(events_bp, url_prefix='/api/events')
app.register_blueprint(results_bp, url_prefix='/api/results')

# Strona główna (opcja)
@app.route('/')
def index():
    return {"message": "Witamy w backendzie aplikacji klubu lekkoatletycznego!"}, 200

# Obsługa błędów (opcjonalne, dla lepszej obsługi użytkownika)
@app.errorhandler(404)
def page_not_found(e):
    return {"error": "Nie znaleziono zasobu."}, 404

@app.errorhandler(500)
def internal_server_error(e):
    return {"error": "Wystąpił błąd wewnętrzny serwera."}, 500

# Punkt wejściowy aplikacji
if __name__ == '__main__':
    app.run(debug=True)

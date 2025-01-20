from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from config import config
from models import db, User, Event, Result, Discipline

# Import and regsiter blueprints
from routes.users import users_bp
from routes.events import events_bp
from routes.results import results_bp
from routes.disciplines import disciplines_bp

# Init Flask app
app = Flask(__name__)
app.config.from_object(config['development'])

app.url_map.strict_slashes = False
# Enable CORS
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:5173", "http://127.0.0.1:5173"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})

# Init database
db.init_app(app)
migrate = Migrate(app, db)

app.register_blueprint(users_bp, url_prefix='/api/users')
app.register_blueprint(events_bp, url_prefix='/api/events')
app.register_blueprint(results_bp, url_prefix='/api/results')
app.register_blueprint(disciplines_bp, url_prefix='/api/disciplines')

# Main page (optional)
@app.route('/')
def index():
    return {"message": "Witamy w backendzie aplikacji klubu lekkoatletycznego!"}, 200

# Error handling (optional)
@app.errorhandler(404)
def page_not_found(e):
    return {"error": "Nie znaleziono zasobu."}, 404

@app.errorhandler(500)
def internal_server_error(e):
    return {"error": "Wystąpił błąd wewnętrzny serwera."}, 500

# App entry point
if __name__ == '__main__':
    app.run(debug=True)

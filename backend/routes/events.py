from auth import token_required
from flask import Blueprint, jsonify, request
from models import Event, db

events_bp = Blueprint('events', __name__)

@events_bp.route('/', methods=['GET'])
@token_required
def get_events(**kwargs):
    try:
        events = Event.query.all()
        return jsonify([
            {
                "id": event.id,
                "name": event.name,
                "date": event.date,
                "location": event.location
            } for event in events]), 200
    except:
        return "Error: błąd wewnętrzny", 500

@events_bp.route('/', methods=['POST'])
@token_required
def create_event(**kwargs):
    jwt_token = kwargs["jwt_token_decoded"]

    data = request.json

    if data == None:
        return "Error: Nie otrzymano danych", 400

    if "name" not in data:
        return "Error: Pole \"name\" jest wymagane", 400
    
    if "date" not in data:
        return "Error: Pole \"date\" jest wymagane", 400

    if "location" not in data:
        return "Error: Pole \"location\" jest wymagane", 400
    
    event = Event(
        name=data["name"],
        date=data["date"],
        location=data["location"],
    )
    
    try:
        db.session.add(event)
        db.session.commit()
    except:
        db.session.rollback()
        return "Error: nie udało się dodać wydarzenia", 500
    
    return "Pomyślnie dodano wydarzenie!", 201

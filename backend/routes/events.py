from auth import token_required
from flask import Blueprint, jsonify, request
from models import Event, db

events_bp = Blueprint("events", __name__)

# Create
@events_bp.route("/create", methods=["POST"])
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
        return "Error: Nie udało się dodać wydarzenia", 500
    
    return event.to_dict(), 201

# Read
@events_bp.route("/", methods=["GET"])
@token_required
def get_events(**kwargs):
    try:
        events = Event.query.all()
        return [event.to_dict() for event in events], 200
    except:
        return "Error: Błąd serwera", 500

# Update
@events_bp.route("/update/<id>", methods=["POST"])
@token_required
def update_event(id, **kwargs):
    event = Event.query.filter_by(id=id).first()
    
    if not event:
        return "Error: Wydarzenie o podanym id nie istnieje", 404
    
    data = request.json

    if data == None:
        return "Error: Nie otrzymano danych", 400
    
    if "name" not in data and "date" not in data and "location" not in data:
        return "Error: Co najmniej jedno z następujących pól jest wymagane: name; date; discipline_id; location", 400
    
    if "name" in data:
        event.name = data["name"]
    
    if "date" in data:
        event.surname = data["date"]
    
    if "location" in data:
        event.email = data["location"]
    
    try:
        db.session.commit()
    except:
        db.session.rollback()
        return "Error: Nie udało się zmienić danych wydarzenia", 500
    
    return event.to_dict(), 200

# Delete
@events_bp.route("/delete/<id>", methods=["DELETE"])
@token_required
def delete_event(id, **kwargs):
    event = Event.query.filter_by(id=id).first()
    
    if not event:
        return "Error: Wydarzenie o podanym id nie istnieje", 404
    
    try:
        db.session.delete(event)
        db.session.commit()
    except:
        db.session.rollback()
        return "Error: Nie udało się usunąć wydarzenia", 500
    
    return "Pomyślnie usunięto wydarzenie", 200
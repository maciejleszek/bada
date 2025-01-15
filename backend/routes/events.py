from auth import token_required
from flask import Blueprint, jsonify, request
from models import Event, db

events_bp = Blueprint('events', __name__)

@events_bp.route('/', methods=['GET'])
@token_required
def get_events():
    events = Event.query.all()
    return jsonify([{"id": event.id, "name": event.name, "date": event.date, "location": event.location} for event in events])

@events_bp.route('/', methods=['POST'])
def create_event():
    data = request.json
    event = Event(name=data['name'], date=data['date'], location=data['location'])
    db.session.add(event)
    db.session.commit()
    return jsonify({"message": "Event created successfully!"}), 201

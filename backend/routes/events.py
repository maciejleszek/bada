from flask import Blueprint, jsonify, request
from models import Event, db
from auth import token_required

events_bp = Blueprint('events', __name__)

@events_bp.route('/', methods=['GET'])
@token_required
def get_events():
    try:
        events = Event.query.all()
        return jsonify([{
            "id": event.id,
            "name": event.name,
            "date": event.date.isoformat(),
            "location": event.location
        } for event in events]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@events_bp.route('/', methods=['POST'])
@token_required
def create_event():
    try:
        data = request.json
        event = Event(
            name=data['name'],
            date=data['date'],
            location=data['location']
        )
        db.session.add(event)
        db.session.commit()
        return jsonify({"message": "Event created successfully!"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
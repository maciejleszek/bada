from flask import Blueprint, jsonify, request
from models import User, Result, Event, Discipline, db
from auth import token_required

results_bp = Blueprint('results', __name__)

# Create
@results_bp.route('/', methods=['POST'])
@token_required
def create_result():
    data = request.json

    if data == None:
        return "Error: Nie otrzymano danych", 400

    if "athlete_id" not in data:
        return "Error: Pole \"athlete_id\" jest wymagane", 400
    
    athlete = User.query.filter_by(id=data["athlete_id"]).first()

    if not athlete:
        return "Error: użytkownik o podanym id nie istnieje", 404
    
    if athlete.role != "zawodnik":
        return "Error: użytkownik o podanym id nie jest zawodnikiem", 400
    
    if "event_id" not in data:
        return "Error: Pole \"event_id\" jest wymagane", 400
    
    event = Event.query.filter_by(id=data["event_id"]).first()

    if not event:
        return "Error: wydarzenie o podanym id nie istnieje", 404

    if "discipline_id" not in data:
        return "Error: Pole \"discipline_id\" jest wymagane", 400
    
    discipline = Discipline.query.filter_by(id=data["discipline_id"]).first()

    if not discipline:
        return "Error: dyscyplina o podanym id nie istnieje", 404

    if "result" not in data:
        return "Error: Pole \"result\" jest wymagane", 400
    
    result = Result(
        athlete_id=data["athlete_id"],
        event_id=data["event_id"],
        discipline_id=data["discipline_id"],
        result=data["result"],
    )

    try:
        db.session.add(result)
        db.session.commit()
    except:
        db.session.rollback()
        return "Error: Nie udało się dodać wyniku", 500

    return result.to_dict(), 201

# Read
@results_bp.route('/', methods=['GET'])
@token_required
def get_all_results():
    results = Result.query.all()
    return jsonify([result.to_dict() for result in results]), 200

@results_bp.route('/athlete/<id>', methods=['GET'])
@token_required
def get_athletes_results(id):
    athlete = User.query.filter_by(id=id).first()

    if not athlete:
        return "Error: użytkownik o podanym id nie istnieje", 404
    
    if athlete.role != "zawodnik":
        return "Error: użytkownik o podanym id nie jest zawodnikiem", 400

    results = Result.query.filter_by(athlete_id=id)
    return jsonify([result.to_dict() for result in results]), 200

# Update
@results_bp.route('/update/<id>', methods=['POST'])
@token_required
def update_result(id):
    result = Result.query.filter_by(id=id).first()
    
    if not result:
        return "Error: Wynik o podanym id nie istnieje", 404
    
    data = request.json

    if data == None:
        return "Error: Nie otrzymano danych", 400
    
    if "athlete_id" not in data and "event_id" not in data and "discipline_id" not in data and "result" not in data:
        return "Error: Co najmniej jedno z następujących pól jest wymagane: athlete_id; event_id; discipline_id; result", 400
    
    if "athlete_id" in data:
        result.name = data["athlete_id"]
    
    if "event_id" in data:
        result.surname = data["event_id"]
    
    if "discipline_id" in data:
        result.email = data["discipline_id"]

    if "result" in data:
        result.role = data["result"]
    
    try:
        db.session.commit()
    except:
        db.session.rollback()
        return "Error: Nie udało się zmienić danych wyniku", 500
    
    return result.to_dict(), 200

# Delete
@results_bp.route('/delete/<id>', methods=['DELETE'])
@token_required
def delete_user(id, **kwargs):
    result = Result.query.filter_by(id=id).first()
    
    if not result:
        return "Error: Wynik o podanym id nie istnieje", 404
    
    try:
        db.session.delete(result)
        db.session.commit()
    except:
        db.session.rollback()
        return "Error: Nie udało się usunąć wyniku", 500
    
    return "Pomyślnie usunięto wynik", 200
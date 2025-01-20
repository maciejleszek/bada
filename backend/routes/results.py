from flask import Blueprint, jsonify, request
from models import User, Result, Event, Discipline, db
from auth import token_required

results_bp = Blueprint('results', __name__)

# Create
@results_bp.route('/create', methods=['POST'])
@token_required
def create_result(**kwargs):
    data = request.json
    print(f" Data {data}")

    if data == None:
        return jsonify({"error": "Nie otrzymano danych"}), 400

    if "athlete_id" not in data:
        return jsonify({"error": "Pole \"athlete_id\" jest wymagane"}), 400
    
    athlete = User.query.filter_by(id=data["athlete_id"]).first()

    if not athlete:
        return jsonify({"error": "użytkownik o podanym id nie istnieje"}), 404
    
    if athlete.role != "athlete":  # Zmienione z "zawodnik" na "athlete"
        return jsonify({"error": "użytkownik o podanym id nie jest zawodnikiem"}), 400
    
    if "event_id" not in data:
        return jsonify({"error": "Pole \"event_id\" jest wymagane"}), 400
    
    event = Event.query.filter_by(id=data["event_id"]).first()

    if not event:
        return jsonify({"error": "wydarzenie o podanym id nie istnieje"}), 404

    if "discipline_id" not in data:
        return jsonify({"error": "Pole \"discipline_id\" jest wymagane"}), 400
    
    discipline = Discipline.query.filter_by(id=data["discipline_id"]).first()

    if not discipline:
        return jsonify({"error": "dyscyplina o podanym id nie istnieje"}), 404

    if "result" not in data:
        return jsonify({"error": "Pole \"result\" jest wymagane"}), 400
    
    result = Result(
        athlete_id=data["athlete_id"],
        event_id=data["event_id"],
        discipline_id=data["discipline_id"],
        result=data["result"],
    )

    try:
        db.session.add(result)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Nie udało się dodać wyniku: {str(e)}"}), 500

    return jsonify(result.to_dict()), 201

# Read
@results_bp.route('/', methods=['GET'])
@token_required
def get_all_results(**kwargs):
    results = Result.query.all()
    return jsonify([result.to_dict() for result in results]), 200

@results_bp.route('/athlete/<id>', methods=['GET'])
@token_required
def get_athletes_results(id, **kwargs):
    athlete = User.query.filter_by(id=id).first()

    if not athlete:
        return jsonify({"error": "użytkownik o podanym id nie istnieje"}), 404
    
    if athlete.role != "athlete":  # Zmienione z "zawodnik" na "athlete"
        return jsonify({"error": "użytkownik o podanym id nie jest zawodnikiem"}), 400

    results = Result.query.filter_by(athlete_id=id)
    return jsonify([result.to_dict() for result in results]), 200

@results_bp.route('/disciplines', methods=['GET'])
@token_required
def get_disciplines(**kwargs):
    """Endpoint do pobierania listy dyscyplin"""
    try:
        disciplines = Discipline.query.all()
        return jsonify([discipline.to_dict() for discipline in disciplines]), 200
    except Exception as e:
        return jsonify({"error": f"Nie udało się pobrać listy dyscyplin: {str(e)}"}), 500

# Update
@results_bp.route('/update/<id>', methods=['POST'])
@token_required
def update_result(id, **kwargs):
    result = Result.query.filter_by(id=id).first()
    
    if not result:
        return jsonify({"error": "Wynik o podanym id nie istnieje"}), 404
    
    data = request.json

    if data == None:
        return jsonify({"error": "Nie otrzymano danych"}), 400
    
    if "athlete_id" not in data and "event_id" not in data and "discipline_id" not in data and "result" not in data:
        return jsonify({"error": "Co najmniej jedno z następujących pól jest wymagane: athlete_id; event_id; discipline_id; result"}), 400
    
    if "athlete_id" in data:
        result.athlete_id = data["athlete_id"]  # Poprawiono nazwy pól
    
    if "event_id" in data:
        result.event_id = data["event_id"]  # Poprawiono nazwy pól
    
    if "discipline_id" in data:
        result.discipline_id = data["discipline_id"]  # Poprawiono nazwy pól

    if "result" in data:
        result.result = data["result"]  # Poprawiono nazwy pól
    
    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Nie udało się zmienić danych wyniku: {str(e)}"}), 500
    
    return jsonify(result.to_dict()), 200

# Delete
@results_bp.route('/delete/<id>', methods=['DELETE'])
@token_required
def delete_result(id, **kwargs):  # Zmieniono nazwę funkcji z delete_user na delete_result
    result = Result.query.filter_by(id=id).first()
    
    if not result:
        return jsonify({"error": "Wynik o podanym id nie istnieje"}), 404
    
    try:
        db.session.delete(result)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Nie udało się usunąć wyniku: {str(e)}"}), 500
    
    return jsonify({"message": "Pomyślnie usunięto wynik"}), 200
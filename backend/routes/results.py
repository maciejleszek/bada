from flask import Blueprint, jsonify, request
from models import User, Result, Event, db

results_bp = Blueprint('results', __name__)

@results_bp.route('/', methods=['GET'])
def get_all_results():
    results = Result.query.all()
    return jsonify([
        {
            "id": result.id,
            "athlete_id": result.athlete_id,
            "event_id": result.event_id,
            "result": result.result
        } for result in results]), 200

@results_bp.route('/<id>', methods=['GET'])
def get_athletes_results(id):
    athlete = User.query.filter_by(id=id).first()

    if not athlete:
        return "Error: użytkownik o podanym id nie istnieje", 404
    
    if athlete.role != "zawodnik":
        return "Error: użytkownik o podanym id nie jest zawodnikiem", 400


    results = Result.query.filter_by(athlete_id=id)
    return jsonify([
        {
            "id": result.id,
            "athlete_id": result.athlete_id,
            "event_id": result.event_id,
            "result": result.result
        } for result in results]), 200

@results_bp.route('/', methods=['POST'])
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

    if "result" not in data:
        return "Error: Pole \"result\" jest wymagane", 400
    
    result = Result(
        athlete_id=data["athlete_id"],
        event_id=data["event_id"],
        result=data["result"]
    )

    try:
        db.session.add(result)
        db.session.commit()
    except:
        db.session.rollback()
        return "Error: Nie udało się dodać wyniku", 500

    return "Pomyślnie dodano wynik!", 201

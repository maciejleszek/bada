from flask import Blueprint, jsonify, request
from models import Result, db

results_bp = Blueprint('results', __name__)

@results_bp.route('/', methods=['GET'])
def get_results():
    results = Result.query.all()
    return jsonify([{"id": result.id, "athlete_id": result.athlete_id, "event_id": result.event_id, "result": result.result} for result in results])

@results_bp.route('/', methods=['POST'])
def create_result():
    data = request.json
    result = Result(athlete_id=data['athlete_id'], event_id=data['event_id'], result=data['result'])
    db.session.add(result)
    db.session.commit()
    return jsonify({"message": "Result added successfully!"}), 201

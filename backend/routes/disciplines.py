from flask import Blueprint, jsonify, request
from models import Discipline, db
from auth import token_required

disciplines_bp = Blueprint("disciplines", __name__)

# Create
@disciplines_bp.route("/create", methods=["POST"])
@token_required
def create_discipline(**kwargs):
    jwt_token = kwargs["jwt_token_decoded"]

    data = request.json

    if data == None:
        return "Error: Nie otrzymano danych", 400

    if "name" not in data:
        return "Error: Pole \"name\" jest wymagane", 400
    
    discipline = Discipline(
        name=data["name"],
    )
    
    try:
        db.session.add(discipline)
        db.session.commit()
    except:
        db.session.rollback()
        return "Error: Nie udało się dodać dyscypliny", 500
    
    return discipline.to_dict(), 201

# Read
@disciplines_bp.route("/", methods=["GET"])
@token_required
def get_disciplines(**kwargs):
    try:
        disciplines = Discipline.query.all()
        return [discipline.to_dict() for discipline in disciplines], 200
    except:
        return "Error: Błąd serwera", 500

# Update
@disciplines_bp.route("/update/<id>", methods=["POST"])
@token_required
def update_discipline(id, **kwargs):
    discipline = Discipline.query.filter_by(id=id).first()
    
    if not discipline:
        return "Error: Dyscyplina o podanym id nie istnieje", 404
    
    data = request.json

    if data == None:
        return "Error: Nie otrzymano danych", 400
    
    if "name" not in data:
        return "Error: Pole \"name\" jest wymagane", 400
    
    if "name" in data:
        discipline.name = data["name"]
    
    try:
        db.session.commit()
    except:
        db.session.rollback()
        return "Error: Nie udało się zmienić danych dyscypliny", 500
    
    return discipline.to_dict(), 200

# Delete
@disciplines_bp.route("/delete/<id>", methods=["DELETE"])
@token_required
def delete_discipline(id, **kwargs):
    discipline = Discipline.query.filter_by(id=id).first()
    
    if not discipline:
        return "Error: Dyscyplina o podanym id nie istnieje", 404
    
    try:
        db.session.delete(discipline)
        db.session.commit()
    except:
        db.session.rollback()
        return "Error: Nie udało się usunąć dyscypliny", 500
    
    return "Pomyślnie usunięto dyscyplinę", 200
from flask import Blueprint, jsonify, request
from models import User, db
from werkzeug.security import check_password_hash, generate_password_hash
from auth import token_required
import jwt

users_bp = Blueprint('users', __name__)

SECRET_KEY = 'your-secret-key'

@users_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    if data == None:
        return "Error: Nie otrzymano danych", 400

    if "email" not in data:
        return "Error: Pole \"email\" jest wymagane", 400
    
    if "password" not in data:
            return "Error: Pole \"password\" jest wymagane", 400

    user = User.query.filter_by(email=data['email']).first()

    if user == None:
        return "Error: Użytkownik nie istnieje w bazie danych", 404

    if check_password_hash(user.password_hash, data["password"]):
        token = jwt.encode(
            {
                "id": user.id,
                "role": user.role,
                "email": user.email,
            },
            SECRET_KEY,
            algorithm="HS256"
        )
        return jsonify({'token': token, 'role': user.role}), 200
    
    return "Error: Adres e-mail lub hasło nie są poprawne", 400

# Create
@users_bp.route('/create', methods=['POST'])
@token_required
def create_user():
    data = request.json

    if data == None:
        return "Error: Nie otrzymano danych", 400

    if "name" not in data:
        return "Error: Pole \"name\" jest wymagane", 400
    
    if "surname" not in data:
        return "Error: Pole \"surname\" jest wymagane", 400

    if "email" not in data:
        return "Error: Pole \"email\" jest wymagane", 400
    
    if "password" not in data:
        return "Error: Pole \"password\" jest wymagane", 400
    
    if "role" not in data:
        return "Error: Pole \"role\" jest wymagane", 400
    
    valid_roles = ["admin", "athlete", "coach"]

    if "role" not in valid_roles:
         return f"Error: Rola musi przyjmować jedną z następujących wartości: {"; ".join(valid_roles)}", 400

    user = User(
        name=data["name"],
        surname=data["surname"],
        email=data["email"],
        password_hash=generate_password_hash(data["password_hash"]),
        role=data["role"]
    )

    try:
        db.session.add(user)
        db.session.commit()
    except:
        db.session.rollback()
        return "Error: Nie udało się dodać użytkownika", 500

    return user.to_dict(), 201

# Read
@users_bp.route('/', methods=['GET'])
@token_required # Tylko dla adminów
def get_all_users(**kwargs):
    token_decoded = kwargs["jwt_token_decoded"]

    if token_decoded["role"] != "admin":
        return "Error: Niewystarczające uprawnienia", 403

    users = User.query.all()
    
    return jsonify([user.to_dict() for user in users]), 200

@users_bp.route('/<id>', methods=['GET'])
@token_required
def get_user(id, **kwargs):
    token_decoded = kwargs["jwt_token_decoded"]

    if token_decoded.role != "admin" and token_decoded.id != id:
        return "Error: Niewystarczające uprawnienia", 403

    user = User.query.filter_by(id=id).first()
    
    if not user:
        return "Error: Użytkownik o podanym id nie istnieje", 404

    return user.to_dict(), 200

# Update
@users_bp.route('/update/<id>', methods=['POST'])
@token_required
def update_user(id, **kwargs):
    token_decoded = kwargs["jwt_token_decoded"]

    if token_decoded.role != "admin" and token_decoded.id != id:
        return "Error: Niewystarczające uprawnienia", 403

    user = User.query.filter_by(id=id).first()
    
    if not user:
        return "Error: Użytkownik o podanym id nie istnieje", 404
    
    data = request.json

    if data == None:
        return "Error: Nie otrzymano danych", 400
    
    if "name" not in data and "surname" not in data and "email" not in data and "role" not in data:
        return "Error: Co najmniej jedno z następujących pól jest wymagane: name; surname; email; role", 400
    
    if "name" in data:
        user.name = data["name"]
    
    if "surname" in data:
        user.surname = data["surname"]
    
    if "email" in data:
        user.email = data["email"]

    if "role" in data:
        valid_roles = ["admin", "athlete", "coach"]
        if "role" not in valid_roles:
            return f"Error: Rola musi przyjmować jedną z następujących wartości: {"; ".join(valid_roles)}", 400
        
        user.role = data["role"]
    
    try:
        db.session.commit()
    except:
        db.session.rollback()
        return "Error: Nie udało się zmienić danych użytkownika", 500
    
    return user.to_dict(), 200

# Delete
@users_bp.route('/delete/<id>', methods=['DELETE'])
@token_required
def delete_user(id, **kwargs):
    token_decoded = kwargs["jwt_token_decoded"]

    if token_decoded.role != "admin":
        return "Error: Niewystarczające uprawnienia", 403

    user = User.query.filter_by(id=id).first()
    
    if not user:
        return "Error: Użytkownik o podanym id nie istnieje", 404
    
    try:
        db.session.delete(user)
        db.session.commit()
    except:
        db.session.rollback()
        return "Error: Nie udało się usunąć użytkownika", 500
    
    return "Pomyślnie usunięto użytkownika", 200
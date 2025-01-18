from flask import Blueprint, jsonify, request
from models import User, db
from werkzeug.security import check_password_hash
import jwt
from auth import token_required

users_bp = Blueprint('users', __name__)

SECRET_KEY = 'your-secret-key'

@users_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data['email']).first()
    if user and check_password_hash(user.password_hash, data['password']):
        token = jwt.encode({
            'id': user.id,
            'role': user.role,
            'email': user.email
        }, SECRET_KEY, algorithm='HS256')
        return jsonify({'token': token, 'role': user.role}), 200
    return jsonify({'message': 'Invalid email or password'}), 401

@users_bp.route('/', methods=['GET'])
@token_required
def get_users():
    try:
        users = User.query.all()
        return jsonify([{
            "id": user.id,
            "name": user.name,
            "surname": user.surname,
            "email": user.email,
            "role": user.role
        } for user in users]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
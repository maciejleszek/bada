import jwt
from flask import request, jsonify
from functools import wraps

SECRET_KEY = 'your-secret-key'

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing'}), 403
        try:
            jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        except:
            return jsonify({'message': 'Token is invalid'}), 403
        return f(*args, **kwargs)
    return decorated

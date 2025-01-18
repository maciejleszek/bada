import jwt
from flask import request, jsonify
from functools import wraps

SECRET_KEY = 'your-secret-key'

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')

        if not token:
            return "Error: Nagłówek \"Authorization\" jest wymagany", 401
        try:
            jwt_decoded = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        except:
            return "Error: niewłaściwy token", 401
        
        # Udostępnij dane w tokenie funkcji wewnętrznej
        kwargs.update({"jwt_token_decoded": jwt_decoded})

        return f(*args, **kwargs)
    return decorated

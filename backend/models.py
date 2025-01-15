from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    surname = db.Column(db.String, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    password_hash = db.Column(db.String, nullable=False)
    role = db.Column(db.String, nullable=False)  # admin, trener, zawodnik

class Event(db.Model):
    __tablename__ = 'events'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    location = db.Column(db.String, nullable=False)

class Result(db.Model):
    __tablename__ = 'results'
    id = db.Column(db.Integer, primary_key=True)
    athlete_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False)
    result = db.Column(db.String, nullable=False)

class Discipline(db.Model):
    __tablename__ = 'disciplines'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)

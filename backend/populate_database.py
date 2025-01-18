from sqlalchemy.orm import sessionmaker
from models import db, User, Event, Result, Discipline
from datetime import datetime
from app import app
from werkzeug.security import generate_password_hash

def populate_database():
    # Users with different roles
    users = [
        User(name="Admin", surname="User", email="admin@example.com", 
             password_hash=generate_password_hash("admin123"), role="admin"),
        User(name="John", surname="Athlete", email="john@example.com", 
             password_hash=generate_password_hash("athlete123"), role="athlete"),
        User(name="Jane", surname="Runner", email="jane@example.com", 
             password_hash=generate_password_hash("athlete123"), role="athlete"),
    ]
    db.session.add_all(users)
    db.session.flush()  # Get IDs for the users

    # Disciplines with specific categories
    disciplines = [
        Discipline(name="100m Sprint"),
        Discipline(name="Long Jump"),
        Discipline(name="Shot Put"),
        Discipline(name="High Jump"),
        Discipline(name="400m Run"),
    ]
    db.session.add_all(disciplines)
    db.session.flush()

    # Events throughout the year
    events = [
        Event(name="Spring Championship", date=datetime(2025, 3, 15), location="City Stadium"),
        Event(name="Summer Games", date=datetime(2025, 6, 20), location="National Arena"),
        Event(name="Fall Competition", date=datetime(2025, 9, 10), location="Regional Center"),
        Event(name="Winter Indoor Meet", date=datetime(2025, 12, 5), location="Indoor Arena"),
    ]
    db.session.add_all(events)
    db.session.flush()

    # Results for athletes
    # For John (user_id = 2)
    results_john = [
        Result(athlete_id=2, event_id=1, result="10.5s"),  # Spring Championship 100m
        Result(athlete_id=2, event_id=2, result="10.3s"),  # Summer Games 100m
        Result(athlete_id=2, event_id=3, result="6.8m"),   # Fall Competition Long Jump
    ]

    # For Jane (user_id = 3)
    results_jane = [
        Result(athlete_id=3, event_id=1, result="11.2s"),  # Spring Championship 100m
        Result(athlete_id=3, event_id=2, result="1.85m"),  # Summer Games High Jump
        Result(athlete_id=3, event_id=4, result="54.3s"),  # Winter Indoor Meet 400m
    ]

    db.session.add_all(results_john + results_jane)
    db.session.commit()

    print("Test data has been successfully added to the database.")

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        populate_database()
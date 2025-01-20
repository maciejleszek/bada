from sqlalchemy.orm import sessionmaker
from models import db, User, Event, Result, Discipline
from datetime import datetime
from app import app
from werkzeug.security import generate_password_hash

def populate_database():
    # Users with different roles
    users = [
        User(
            name="Admin",
            surname="User",
            email="admin@example.com",
            password_hash=generate_password_hash("admin123"),
            role="admin"
        ),
        User(
            name="John",
            surname="Athlete",
            email="john@example.com",
            password_hash=generate_password_hash("athlete123"),
            role="athlete"
        ),
        User(
            name="Jane",
            surname="Runner",
            email="jane@example.com",
            password_hash=generate_password_hash("athlete123"),
            role="athlete"
        ),
    ]
    db.session.add_all(users)
    db.session.flush()

    # Disciplines with different categories
    disciplines = [
        Discipline(name="100 m sprint"),
        Discipline(name="Long jump"),
        Discipline(name="Shot put"),
        Discipline(name="High Jump"),
        Discipline(name="400 m Run"),
    ]
    db.session.add_all(disciplines)
    db.session.flush()

    # Events
    events = [
        Event(
            name="Spring Championship",
            date=datetime(2025, 3, 15),
            location="City Stadium"
        ),
        Event(
            name="Summer Games",
            date=datetime(2025, 6, 20),
            location="National Arena"
        ),
        Event(
            name="Fall Competition",
            date=datetime(2025, 9, 10),
            location="Regional Center"
        ),
        Event(
            name="Winter Indoor Meet",
            date=datetime(2025, 12, 5),
            location="Indoor Arena"
        ),
    ]
    db.session.add_all(events)
    db.session.flush()

    # Results

    # John Athlete: id=2
    results_john = [
        Result(
            athlete_id=2, # John Athlete
            event_id=1, # Spring Championship
            discipline_id=1, # 100 m sprint
            result="10.5 s"
        ),
        Result(
            athlete_id=2, # John Athlete
            event_id=2, # Summer Games
            discipline_id=1, # 100 m sprint
            result="10.3 s"
        ),
        Result(
            athlete_id=2, # John Athlete
            event_id=3, # Fall Competition
            discipline_id=2, # Long jump
            result="6.8 m"
        ),
    ]

    # Jane Runner: id=3
    results_jane = [
        Result(
            athlete_id=3, # Jane Runner
            event_id=1, # Spring Championship
            discipline_id=1, # 100 m sprint
            result="11.2 s"
        ),
        Result(
            athlete_id=3, # Jane Runner
            event_id=2, # Summer Games
            discipline_id=4, # High jump
            result="1.85 m"
        ),
        Result(
            athlete_id=3, # Jane Runner
            event_id=4, # Winter Indoor Meet
            discipline_id=5, # 400 m run
            result="54.3 s"
        ),
    ]
    db.session.add_all(results_john + results_jane)
    db.session.flush()

    db.session.commit()
    print("Test data has been successfully added to the database.")

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        populate_database()

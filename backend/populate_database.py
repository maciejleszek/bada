from sqlalchemy.orm import sessionmaker
from models import db, User, Event, Result, Discipline
from datetime import datetime
from app import app  # Import aplikacji Flask

# Wypełnianie bazy danymi testowymi
def populate_database():
    # Użytkownicy
    users = [
        User(name="John", surname="Doe", email="john.doe@example.com", password_hash="hashed_password", role="admin"),
        User(name="Alice", surname="Smith", email="alice.smith@example.com", password_hash="hashed_password", role="athlete"),
        User(name="Bob", surname="Johnson", email="bob.johnson@example.com", password_hash="hashed_password", role="coach"),
    ]
    db.session.add_all(users)

    # Dyscypliny
    disciplines = [
        Discipline(name="100m sprint"),
        Discipline(name="Long jump"),
        Discipline(name="Shot put"),
    ]
    db.session.add_all(disciplines)

    # Wydarzenia
    events = [
        Event(name="Regional Championship", date=datetime(2025, 3, 15), location="City Stadium"),
        Event(name="National Cup", date=datetime(2025, 6, 20), location="National Arena"),
    ]
    db.session.add_all(events)

    # Wyniki
    results = [
        Result(athlete_id=2, event_id=1, result="10.5s"),
        Result(athlete_id=2, event_id=2, result="10.7s"),
    ]
    db.session.add_all(results)

    # Zatwierdzenie zmian
    db.session.commit()
    print("Dane testowe zostały dodane do bazy danych.")

if __name__ == "__main__":
    with app.app_context():  # Ustawienie kontekstu aplikacji
        db.create_all()  # Tworzenie tabel, jeśli nie istnieją
        populate_database()

import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from app.db.engine import SessionLocal
from app.db.base import Base
from app.db.engine import engine
from app.models import Skill


def seed_skills():
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    skills_data = [
        ("Python", "Programming"),
        ("JavaScript", "Programming"),
        ("React", "Web Development"),
        ("Node.js", "Web Development"),
        ("Machine Learning", "Data Science"),
        ("UI/UX Design", "Design"),
        ("Public Speaking", "Communication"),
        ("Photography", "Creative"),
        ("SQL", "Databases"),
        ("Data Structures", "Computer Science"),
        ("Git", "Tools"),
        ("Docker", "DevOps"),
        ("MATLAB", "Engineering"),
        ("CAD Design", "Engineering"),
        ("C++", "Programming"),
        ("Java", "Programming"),
        ("Go", "Programming"),
        ("Figma", "Design"),
        ("Writing", "Communication"),
        ("Leadership", "Management"),
        ("Video Editing", "Creative"),
        ("Data Analysis", "Data Science"),
        ("Embedded Systems", "Engineering"),
        ("Cybersecurity", "Security"),
        ("Cloud Computing", "DevOps"),
        ("VLSI Design", "Engineering"),
    ]

    try:
        added = 0

        for name, category in skills_data:
            existing = db.query(Skill).filter(Skill.name == name).first()

            if existing:
                continue

            skill = Skill(
                name=name,
                category=category,
                description=f"Learn and teach {name}",
            )

            db.add(skill)
            added += 1

        db.commit()

        print(f"Successfully added {added} skills.")

        total = db.query(Skill).count()
        print(f"Total skills in database: {total}")

    except Exception as e:
        db.rollback()
        print(f"Error: {e}")
        raise

    finally:
        db.close()


if __name__ == "__main__":
    seed_skills()
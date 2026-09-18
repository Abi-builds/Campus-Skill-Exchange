import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from datetime import datetime, timedelta, timezone
from app.db.engine import SessionLocal
from app.db.base import Base
from app.db.engine import engine
from app.models import User, Skill, UserSkill, ExchangeRequest, Session, Review, Notification, Message
from app.models.user_skill import SkillType, ProficiencyLevel
from app.models.exchange_request import RequestStatus
from app.models.session import SessionStatus
from app.core.security import hash_password


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        if db.query(User).first():
            print("Database already seeded. Skipping.")
            return

        students = [
            ("Arun Kumar", "arun@campus.local", "IT", 3, "Passionate about web development and open source."),
            ("Priya Sharma", "priya@campus.local", "CSE", 2, "AI/ML enthusiast. Love building things with Python."),
            ("Rahul Verma", "rahul@campus.local", "ECE", 4, "Hardware and embedded systems. Also into photography."),
            ("Divya Patel", "divya@campus.local", "Mechanical", 1, "CAD design and 3D printing. Learning to code."),
            ("Karthik Nair", "karthik@campus.local", "CSE", 3, "Full-stack developer. React and Node.js."),
            ("Meena Iyer", "meena@campus.local", "IT", 2, "UI/UX design and frontend development."),
            ("Vikram Singh", "vikram@campus.local", "Electrical", 4, "Power systems and renewable energy."),
            ("Ananya Reddy", "ananya@campus.local", "CSE", 1, "Data structures and algorithms. Competitive programming."),
            ("Rohan Gupta", "rohan@campus.local", "ECE", 3, "IoT and robotics. Arduino and Raspberry Pi."),
            ("Sneha Joshi", "sneha@campus.local", "IT", 2, "Database management and SQL. Also into music."),
            ("Aditya Mehta", "aditya@campus.local", "Mechanical", 3, "MATLAB and simulation. Learning Python."),
            ("Neha Kapoor", "neha@campus.local", "CSE", 4, "Machine learning and deep learning. Published researcher."),
            ("Sanjay Rao", "sanjay@campus.local", "IT", 1, "Cybersecurity basics. Linux enthusiast."),
            ("Pooja Desai", "pooja@campus.local", "Electrical", 2, "VLSI design. Want to learn programming."),
            ("Kiran Bhat", "kiran@campus.local", "ECE", 2, "Signal processing. Photography hobbyist."),
        ]

        password_hash = hash_password("Demo@123")
        users = []
        for name, email, dept, year, bio in students:
            u = User(name=name, email=email, password_hash=password_hash, department=dept, year=year, bio=bio)
            db.add(u)
            db.flush()
            users.append(u)

        demo_user = User(
            name="Demo Student", email="demo@campus.local", password_hash=password_hash,
            department="CSE", year=2, bio="Demo account for testing the skill exchange platform."
        )
        db.add(demo_user)
        db.flush()
        users.append(demo_user)

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

        skills = []
        for name, category in skills_data:
            s = Skill(name=name, category=category, description=f"Learn and teach {name}")
            db.add(s)
            db.flush()
            skills.append(s)

        skill_map = {s.name: s for s in skills}

        demo_skills = [
            ("Python", "TEACH", "ADVANCED"),
            ("React", "TEACH", "INTERMEDIATE"),
            ("JavaScript", "LEARN", "BEGINNER"),
            ("Machine Learning", "LEARN", "BEGINNER"),
            ("UI/UX Design", "LEARN", "BEGINNER"),
            ("Data Structures", "TEACH", "INTERMEDIATE"),
            ("Git", "TEACH", "ADVANCED"),
        ]
        for skill_name, stype, level in demo_skills:
            us = UserSkill(
                user_id=demo_user.id,
                skill_id=skill_map[skill_name].id,
                skill_type=SkillType(stype),
                proficiency_level=ProficiencyLevel(level),
            )
            db.add(us)

        user_skills_data = [
            (0, "Python", "TEACH", "EXPERT"),
            (0, "React", "TEACH", "ADVANCED"),
            (0, "JavaScript", "LEARN", "BEGINNER"),
            (0, "Machine Learning", "LEARN", "BEGINNER"),
            (1, "Python", "TEACH", "EXPERT"),
            (1, "Machine Learning", "TEACH", "ADVANCED"),
            (1, "React", "LEARN", "BEGINNER"),
            (1, "UI/UX Design", "LEARN", "BEGINNER"),
            (2, "MATLAB", "TEACH", "EXPERT"),
            (2, "Embedded Systems", "TEACH", "ADVANCED"),
            (2, "Photography", "TEACH", "ADVANCED"),
            (2, "Python", "LEARN", "BEGINNER"),
            (3, "CAD Design", "TEACH", "INTERMEDIATE"),
            (3, "Python", "LEARN", "BEGINNER"),
            (3, "JavaScript", "LEARN", "BEGINNER"),
            (4, "React", "TEACH", "EXPERT"),
            (4, "Node.js", "TEACH", "EXPERT"),
            (4, "Python", "LEARN", "INTERMEDIATE"),
            (4, "Machine Learning", "LEARN", "BEGINNER"),
            (5, "UI/UX Design", "TEACH", "EXPERT"),
            (5, "Figma", "TEACH", "ADVANCED"),
            (5, "Python", "LEARN", "BEGINNER"),
            (5, "Data Structures", "LEARN", "BEGINNER"),
            (6, "MATLAB", "TEACH", "ADVANCED"),
            (6, "Cloud Computing", "TEACH", "INTERMEDIATE"),
            (6, "Python", "LEARN", "BEGINNER"),
            (7, "Data Structures", "TEACH", "ADVANCED"),
            (7, "Python", "TEACH", "INTERMEDIATE"),
            (7, "UI/UX Design", "LEARN", "BEGINNER"),
            (7, "Photography", "LEARN", "BEGINNER"),
            (8, "Embedded Systems", "TEACH", "ADVANCED"),
            (8, "Python", "TEACH", "INTERMEDIATE"),
            (8, "React", "LEARN", "BEGINNER"),
            (9, "SQL", "TEACH", "ADVANCED"),
            (9, "Python", "LEARN", "BEGINNER"),
            (9, "JavaScript", "LEARN", "BEGINNER"),
            (10, "MATLAB", "TEACH", "INTERMEDIATE"),
            (10, "Python", "LEARN", "BEGINNER"),
            (10, "Java", "LEARN", "BEGINNER"),
            (11, "Machine Learning", "TEACH", "EXPERT"),
            (11, "Python", "TEACH", "EXPERT"),
            (11, "React", "LEARN", "BEGINNER"),
            (12, "Cybersecurity", "TEACH", "INTERMEDIATE"),
            (12, "Python", "LEARN", "BEGINNER"),
            (12, "Git", "LEARN", "BEGINNER"),
            (13, "VLSI Design", "TEACH", "INTERMEDIATE"),
            (13, "Python", "LEARN", "BEGINNER"),
            (13, "JavaScript", "LEARN", "BEGINNER"),
            (14, "Photography", "TEACH", "ADVANCED"),
            (14, "Python", "LEARN", "BEGINNER"),
            (14, "React", "LEARN", "BEGINNER"),
        ]

        for user_idx, skill_name, stype, level in user_skills_data:
            us = UserSkill(
                user_id=users[user_idx].id,
                skill_id=skill_map[skill_name].id,
                skill_type=SkillType(stype),
                proficiency_level=ProficiencyLevel(level),
            )
            db.add(us)

        db.flush()

        er1 = ExchangeRequest(
            sender_id=users[1].id, receiver_id=users[0].id,
            message="I can teach you ML if you teach me React!",
            status=RequestStatus.PENDING,
        )
        er2 = ExchangeRequest(
            sender_id=users[4].id, receiver_id=users[0].id,
            message="Want to exchange React for Python skills?",
            status=RequestStatus.ACCEPTED,
        )
        er3 = ExchangeRequest(
            sender_id=users[5].id, receiver_id=users[0].id,
            message="I can help with UI/UX, interested in learning Python basics.",
            status=RequestStatus.PENDING,
        )
        db.add_all([er1, er2, er3])
        db.flush()

        session1 = Session(
            exchange_request_id=er2.id,
            teacher_id=users[0].id,
            learner_id=users[4].id,
            skill_id=skill_map["Python"].id,
            scheduled_at=datetime.now(timezone.utc) + timedelta(days=3),
            duration_minutes=60,
            meeting_link="https://meet.example.com/session1",
            status=SessionStatus.SCHEDULED,
        )
        db.add(session1)
        db.flush()

        review1 = Review(
            session_id=session1.id,
            reviewer_id=users[4].id,
            reviewed_user_id=users[0].id,
            rating=5,
            comment="Excellent Python teacher! Very patient and clear explanations.",
        )
        db.add(review1)

        notif1 = Notification(
            user_id=users[0].id,
            type="EXCHANGE_REQUEST",
            title="New Exchange Request",
            message=f"{users[1].name} wants to exchange skills with you",
        )
        db.add(notif1)

        msg1 = Message(
            sender_id=users[4].id,
            receiver_id=users[0].id,
            content="Hey! Ready for our Python session?",
        )
        db.add(msg1)

        db.commit()
        print(f"Seeded {len(users)} users, {len(skills)} skills, and sample data.")
        print("Demo account: demo@campus.local / Demo@123")

    except Exception as e:
        db.rollback()
        print(f"Error seeding: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()

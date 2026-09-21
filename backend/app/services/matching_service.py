from sqlalchemy.orm import Session
from app.models.user import User
from app.models.user_skill import UserSkill, SkillType
from app.models.exchange_request import ExchangeRequest, RequestStatus
from app.repositories.user_repo import UserRepository
from app.repositories.user_skill_repo import UserSkillRepository
from app.repositories.exchange_request_repo import ExchangeRequestRepository


class MatchingService:
    def __init__(self, db: Session):
        self.user_repo = UserRepository(db)
        self.user_skill_repo = UserSkillRepoWrapper(db)
        self.exchange_repo = ExchangeRequestRepoWrapper(db)

    def find_matches(self, user_id: int) -> list[dict]:
        current_user = self.user_repo.get_by_id(user_id)
        if not current_user:
            return []

        my_skills = self.user_skill_repo.get_by_user(user_id)
        skills_i_want = {us.skill_id for us in my_skills if us.skill_type == SkillType.LEARN}
        skills_i_teach = {us.skill_id for us in my_skills if us.skill_type == SkillType.TEACH}

        all_users = self.user_repo.list_all()
        matches = []

        for candidate in all_users:
            if candidate.id == user_id:
                continue

            candidate_skills = self.user_skill_repo.get_by_user(candidate.id)
            candidate_teaches = {us.skill_id for us in candidate_skills if us.skill_type == SkillType.TEACH}
            candidate_wants = {us.skill_id for us in candidate_skills if us.skill_type == SkillType.LEARN}

            teach_overlap = skills_i_want & candidate_teaches
            learn_overlap = skills_i_teach & candidate_wants

            if not teach_overlap and not learn_overlap:
                continue

            score = 0
            reasons = []

            if teach_overlap:
                score += 40 * len(teach_overlap)
                reasons.append(f"They can teach skills you want to learn")

            if learn_overlap:
                score += 40 * len(learn_overlap)
                reasons.append(f"You can teach skills they want to learn")

            if teach_overlap and learn_overlap:
                score += 10
                reasons.append("Mutual exchange possible")

            if current_user.department == candidate.department:
                score += 5
                reasons.append("Same department")

            if current_user.year == candidate.year:
                score += 5
                reasons.append("Same year")

            score = min(score, 100)

            existing = self.exchange_repo.get_pending_between(user_id, candidate.id)

            matches.append({
                "user": candidate,
                "score": score,
                "reasons": reasons,
                "has_pending_request": existing is not None,
            })

        matches.sort(key=lambda m: m["score"], reverse=True)
        return matches


class UserSkillRepoWrapper:
    def __init__(self, db: Session):
        self.repo = UserSkillRepository(db)

    def get_by_user(self, user_id: int):
        return self.repo.get_by_user(user_id)


class ExchangeRequestRepoWrapper:
    def __init__(self, db: Session):
        self.repo = ExchangeRequestRepository(db)

    def get_pending_between(self, sender_id: int, receiver_id: int):
        return self.repo.get_pending_between(sender_id, receiver_id)

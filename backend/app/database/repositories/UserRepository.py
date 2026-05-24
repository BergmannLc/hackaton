from sqlalchemy.orm import Session
from app.database.models.UserEntity import User

class UserRepository:

    def __init__(self, db: Session):
        self.db = db

    def find_all(self):
        return self.db.query(User).all()

    def find_by_id(self, id: int):
        return self.db.query(User).filter(User.id == id).first()

    def find_by_matricula(self, matricula: str):
        return self.db.query(User).filter(User.matricula == matricula).first()

    def save(self, user: User):
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def delete(self, user: User):
        self.db.delete(user)
        self.db.commit()
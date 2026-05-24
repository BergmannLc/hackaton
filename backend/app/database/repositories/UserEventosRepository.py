from sqlalchemy.orm import Session
from app.database.models.UserEventosEntity import UserEventos

class UserEventosRepository:

    def __init__(self, db: Session):
        self.db = db

    def find_by_evento(self, evento_id: int):
        return self.db.query(UserEventos).filter(UserEventos.evento_id == evento_id).all()

    def find_by_user_and_evento(self, user_id: int, evento_id: int):
        return self.db.query(UserEventos).filter(
            UserEventos.user_id == user_id,
            UserEventos.evento_id == evento_id
        ).first()

    def count_inscritos(self, evento_id: int):
        return self.db.query(UserEventos).filter(UserEventos.evento_id == evento_id).count()

    def save(self, user_evento: UserEventos):
        self.db.add(user_evento)
        self.db.commit()
        self.db.refresh(user_evento)
        return user_evento

    def delete(self, user_evento: UserEventos):
        self.db.delete(user_evento)
        self.db.commit()

    def update_presenca(self, user_id: int, evento_id: int, presenca: bool):
        user_evento = self.find_by_user_and_evento(user_id, evento_id)
        if user_evento:
            user_evento.presenca = presenca
            self.db.commit()
            self.db.refresh(user_evento)
        return user_evento
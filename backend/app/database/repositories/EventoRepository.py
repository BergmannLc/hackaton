from sqlalchemy.orm import Session
from app.database.models.EventosEntity import Eventos

class EventoRepository:

    def __init__(self, db: Session):
        self.db = db

    def find_all(self):
        return self.db.query(Eventos).all()

    def find_by_id(self, id: int):
        return self.db.query(Eventos).filter(Eventos.id == id).first()

    def save(self, evento: Eventos):
        self.db.add(evento)
        self.db.commit()
        self.db.refresh(evento)
        return evento

    def delete(self, evento: Eventos):
        self.db.delete(evento)
        self.db.commit()
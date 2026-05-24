from sqlalchemy.orm import Session
from app.database.models.EventoCursosEntity import EventoCursos

class EventoCursosRepository:

    def __init__(self, db: Session):
        self.db = db

    def find_by_evento(self, evento_id: int):
        return self.db.query(EventoCursos).filter(EventoCursos.evento_id == evento_id).all()

    def find_by_curso(self, curso_id: int):
        return self.db.query(EventoCursos).filter(EventoCursos.curso_id == curso_id).all()

    def save(self, evento_curso: EventoCursos):
        self.db.add(evento_curso)
        self.db.commit()
        return evento_curso

    def delete(self, evento_curso: EventoCursos):
        self.db.delete(evento_curso)
        self.db.commit()
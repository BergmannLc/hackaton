from sqlalchemy.orm import Session
from app.database.models.Cursos import Cursos

class CursoRepository:

    def __init__(self, db: Session):
        self.db = db

    def find_all(self):
        return self.db.query(Cursos).all()

    def find_by_id(self, id: int):
        return self.db.query(Cursos).filter(Cursos.id == id).first()

    def save(self, curso: Cursos):
        self.db.add(curso)
        self.db.commit()
        self.db.refresh(curso)
        return curso

    def delete(self, curso: Cursos):
        self.db.delete(curso)
        self.db.commit()
from app.database.models.Cursos import Cursos
from app.database.repositories.CursoRepository import CursoRepository

class CursoService:

    def __init__(self, repository: CursoRepository):
        self.repository = repository

    def find_all(self):
        return self.repository.find_all()

    def find_by_id(self, id: int):
        return self.repository.find_by_id(id)

    def create(self, nome: str):
        curso = Cursos(
            nome=nome
        )
        return self.repository.save(curso)

    def delete(self, id: int):
        curso = self.repository.find_by_id(id)
        if curso:
            self.repository.delete(curso)
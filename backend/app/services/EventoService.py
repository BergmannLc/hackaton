from app.database.models.EventosEntity import Eventos
from app.database.models.EventoCursosEntity import EventoCursos
from app.database.repositories.EventoRepository import EventoRepository
from app.database.repositories.EventoCursoRepository import EventoCursosRepository
from datetime import datetime
from typing import Optional, List

class EventoService:

    def __init__(self, evento_repository: EventoRepository, evento_cursos_repository: EventoCursosRepository):
        self.evento_repository = evento_repository
        self.evento_cursos_repository = evento_cursos_repository

    def find_all(self):
        return self.evento_repository.find_all()

    def find_by_id(self, id: int):
        return self.evento_repository.find_by_id(id)

    def create(self, nome: str, data: datetime, max_user: int, curso_ids: List[int],
               descricao: Optional[str] = None, local: Optional[str] = None,
               palestrante: Optional[str] = None, tipo: Optional[str] = None,
               hora_inicio: Optional[str] = None, hora_fim: Optional[str] = None,
               horas: Optional[int] = None, imagem: Optional[str] = None):
        evento = Eventos(
            nome=nome,
            descricao=descricao,
            local=local,
            palestrante=palestrante,
            tipo=tipo,
            data=data,
            hora_inicio=hora_inicio,
            hora_fim=hora_fim,
            horas=horas,
            imagem=imagem,
            max_user=max_user
        )
        saved_evento = self.evento_repository.save(evento)

        for curso_id in curso_ids:
            evento_curso = EventoCursos(evento_id=saved_evento.id, curso_id=curso_id)
            self.evento_cursos_repository.save(evento_curso)

        return saved_evento

    def delete(self, id: int):
        evento = self.evento_repository.find_by_id(id)
        if evento:
            self.evento_repository.delete(evento)
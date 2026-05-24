from app.database.models.EventosEntity import Eventos
from app.database.repositories.EventoRepository import EventoRepository
from datetime import datetime
from typing import Optional

class EventoService:

    def __init__(self, repository: EventoRepository):
        self.repository = repository

    def find_all(self):
        return self.repository.find_all()

    def find_by_id(self, id: int):
        return self.repository.find_by_id(id)

    def create(self, nome: str, data: datetime, max_user: int,
               descricao: Optional[str] = None, local: Optional[str] = None,
               palestrante: Optional[str] = None, tipo: Optional[str] = None,
               hora_inicio: Optional[str] = None, hora_fim: Optional[str] = None,
               imagem: Optional[str] = None):
        evento = Eventos(
            nome=nome,
            descricao=descricao,
            local=local,
            palestrante=palestrante,
            tipo=tipo,
            data=data,
            hora_inicio=hora_inicio,
            hora_fim=hora_fim,
            imagem=imagem,
            max_user=max_user
        )
        return self.repository.save(evento)

    def delete(self, id: int):
        evento = self.repository.find_by_id(id)
        if evento:
            self.repository.delete(evento)
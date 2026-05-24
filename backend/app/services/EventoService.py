from app.database.models.EventosEntity import Eventos
from app.database.repositories.EventoRepository import EventoRepository
from datetime import datetime

class EventoService:

    def __init__(self, repository: EventoRepository):
        self.repository = repository

    def find_all(self):
        return self.repository.find_all()

    def find_by_id(self, id: int):
        return self.repository.find_by_id(id)

    def create(self, nome: str, data: datetime, max_user: int):
        evento = Eventos(
            nome=nome,
            data=data,
            max_user=max_user
        )
        return self.repository.save(evento)

    def delete(self, id: int):
        evento = self.repository.find_by_id(id)
        if evento:
            self.repository.delete(evento)
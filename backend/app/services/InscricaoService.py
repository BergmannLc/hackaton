from fastapi import HTTPException
from app.database.models.UserEventosEntity import UserEventos
from app.database.repositories.UserEventosRepository import UserEventosRepository
from app.database.repositories.EventoRepository import EventoRepository
from app.database.repositories.UserRepository import UserRepository

class InscricaoService:

    def __init__(self, user_eventos_repository: UserEventosRepository,
                 evento_repository: EventoRepository,
                 user_repository: UserRepository):
        self.user_eventos_repository = user_eventos_repository
        self.evento_repository = evento_repository
        self.user_repository = user_repository

    def inscrever(self, user_id: int, evento_id: int):
        evento = self.evento_repository.find_by_id(evento_id)
        if not evento:
            raise HTTPException(status_code=404, detail="Evento nao encontrado")

        ja_inscrito = self.user_eventos_repository.find_by_user_and_evento(user_id, evento_id)
        if ja_inscrito:
            raise HTTPException(status_code=400, detail="Aluno ja inscrito neste evento")

        total_inscritos = self.user_eventos_repository.count_inscritos(evento_id)
        if total_inscritos >= evento.max_user:
            raise HTTPException(status_code=400, detail="Evento lotado")

        user_evento = UserEventos(user_id=user_id, evento_id=evento_id, presenca=False)
        return self.user_eventos_repository.save(user_evento)

    def desinscrever(self, user_id: int, evento_id: int):
        user_evento = self.user_eventos_repository.find_by_user_and_evento(user_id, evento_id)
        if not user_evento:
            raise HTTPException(status_code=404, detail="Inscricao nao encontrada")
        self.user_eventos_repository.delete(user_evento)

    def get_inscritos(self, evento_id: int):
        return self.user_eventos_repository.find_by_evento(evento_id)

    def confirmar_presenca_manual(self, user_id: int, evento_id: int, presenca: bool):
        user_evento = self.user_eventos_repository.find_by_user_and_evento(user_id, evento_id)
        if not user_evento:
            raise HTTPException(status_code=404, detail="Inscricao nao encontrada")
        return self.user_eventos_repository.update_presenca(user_id, evento_id, presenca)
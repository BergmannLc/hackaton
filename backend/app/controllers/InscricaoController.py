from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.database.repositories.UserEventosRepository import UserEventosRepository
from app.database.repositories.EventoRepository import EventoRepository
from app.database.repositories.UserRepository import UserRepository
from app.services.InscricaoService import InscricaoService
from app.services.TokenService import get_current_user, require_credenciado, require_aluno

router = APIRouter(prefix="/inscricoes", tags=["Inscricoes"])

def get_service(db: Session = Depends(get_db)):
    user_eventos_repository = UserEventosRepository(db)
    evento_repository = EventoRepository(db)
    user_repository = UserRepository(db)
    return InscricaoService(user_eventos_repository, evento_repository, user_repository)

@router.post("/eventos/{evento_id}/inscrever")
def inscrever(evento_id: int, db: Session = Depends(get_db), service: InscricaoService = Depends(get_service), current_user = Depends(require_aluno)):
    from app.database.repositories.UserRepository import UserRepository
    user_repo = UserRepository(db)
    user = user_repo.find_by_matricula(current_user["matricula"])
    return service.inscrever(user.id, evento_id)

@router.delete("/eventos/{evento_id}/desinscrever")
def desinscrever(evento_id: int, db: Session = Depends(get_db), service: InscricaoService = Depends(get_service), current_user = Depends(require_aluno)):
    from app.database.repositories.UserRepository import UserRepository
    user_repo = UserRepository(db)
    user = user_repo.find_by_matricula(current_user["matricula"])
    service.desinscrever(user.id, evento_id)
    return {"message": "Inscricao cancelada com sucesso"}

@router.get("/eventos/{evento_id}/inscritos")
def get_inscritos(evento_id: int, service: InscricaoService = Depends(get_service), current_user = Depends(require_credenciado)):
    return service.get_inscritos(evento_id)

@router.patch("/eventos/{evento_id}/presenca/{user_id}")
def confirmar_presenca(evento_id: int, user_id: int, presenca: bool, service: InscricaoService = Depends(get_service), current_user = Depends(require_credenciado)):
    return service.confirmar_presenca_manual(user_id, evento_id, presenca)
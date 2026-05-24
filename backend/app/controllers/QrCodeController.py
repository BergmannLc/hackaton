from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.database.repositories.EventoRepository import EventoRepository
from app.database.repositories.UserEventosRepository import UserEventosRepository
from app.database.repositories.UserRepository import UserRepository
from app.services.QrCodeService import QrCodeService
from app.services.TokenService import require_credenciado, require_aluno

router = APIRouter(prefix="/qrcode", tags=["QrCode"])

def get_service(db: Session = Depends(get_db)):
    evento_repository = EventoRepository(db)
    user_eventos_repository = UserEventosRepository(db)
    return QrCodeService(evento_repository, user_eventos_repository)

@router.get("/eventos/{evento_id}/gerar")
def gerar_qrcode(evento_id: int, service: QrCodeService = Depends(get_service), current_user = Depends(require_credenciado)):
    return service.gerar_qrcode(evento_id)

@router.post("/eventos/{evento_id}/confirmar")
def confirmar_presenca(evento_id: int, token: str, db: Session = Depends(get_db), service: QrCodeService = Depends(get_service), current_user = Depends(require_aluno)):
    user_repo = UserRepository(db)
    user = user_repo.find_by_matricula(current_user["matricula"])
    return service.confirmar_presenca_qrcode(user.id, evento_id, token)
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.database.repositories.SugestaoRepository import SugestaoRepository
from app.services.SugestaoService import SugestaoService
from app.dtos.SugestaoDto import SugestaoRequest, SugestaoResponse
from app.services.TokenService import get_current_user, require_credenciado, require_aluno

router = APIRouter(prefix="/sugestoes", tags=["Sugestoes"])

def get_service(db: Session = Depends(get_db)):
    repository = SugestaoRepository(db)
    return SugestaoService(repository)

@router.get("/", response_model=list[SugestaoResponse])
def find_all(service: SugestaoService = Depends(get_service), current_user = Depends(get_current_user)):
    return service.find_all()

@router.get("/{id}", response_model=SugestaoResponse)
def find_by_id(id: int, service: SugestaoService = Depends(get_service), current_user = Depends(get_current_user)):
    return service.find_by_id(id)

@router.post("/create", response_model=SugestaoResponse)
def create(request: SugestaoRequest, service: SugestaoService = Depends(get_service), current_user = Depends(require_aluno)):
    return service.create(
        nome=request.nome,
        descricao=request.descricao,
        user_id=request.user_id
    )

@router.delete("/{id}")
def delete(id: int, service: SugestaoService = Depends(get_service), current_user = Depends(get_current_user)):
    service.delete(id)
    return {"message": "Sugestao deletada com sucesso"}

@router.patch("/{id}/status")
def update_status(id: int, status: str, service: SugestaoService = Depends(get_service), current_user = Depends(require_credenciado)):
    return service.update_status(id, status)
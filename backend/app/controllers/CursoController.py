from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.database.repositories.CursoRepository import CursoRepository
from app.services.CursoService import CursoService
from app.dtos.CursoDto import CursoRequest, CursoResponse

router = APIRouter(prefix="/cursos", tags=["Cursos"])

def get_service(db: Session = Depends(get_db)):
    repository = CursoRepository(db)
    return CursoService(repository)

@router.get("/", response_model=list[CursoResponse])
def find_all(service: CursoService = Depends(get_service)):
    return service.find_all()

@router.get("/{id}", response_model=CursoResponse)
def find_by_id(id: int, service: CursoService = Depends(get_service)):
    return service.find_by_id(id)

@router.post("/create", response_model=CursoResponse)
def create(request: CursoRequest, service: CursoService = Depends(get_service)):
    return service.create(nome=request.nome)

@router.delete("/{id}")
def delete(id: int, service: CursoService = Depends(get_service)):
    service.delete(id)
    return {"message": "Curso deletado com sucesso"}
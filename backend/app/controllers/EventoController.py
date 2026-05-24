from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.database.repositories.EventoRepository import EventoRepository
from app.services.EventoService import EventoService
from app.dtos.EventoDto import EventoRequest, EventoResponse

router = APIRouter(prefix="/eventos", tags=["Eventos"])

def get_service(db: Session = Depends(get_db)):
    repository = EventoRepository(db)
    return EventoService(repository)

@router.get("/", response_model=list[EventoResponse])
def find_all(service: EventoService = Depends(get_service)):
    return service.find_all()

@router.get("/{id}", response_model=EventoResponse)
def find_by_id(id: int, service: EventoService = Depends(get_service)):
    return service.find_by_id(id)

@router.post("/create", response_model=EventoResponse)
def create(request: EventoRequest, service: EventoService = Depends(get_service)):
    return service.create(
        nome=request.nome,
        data=request.data,
        max_user=request.max_user
    )

@router.delete("/{id}")
def delete(id: int, service: EventoService = Depends(get_service)):
    service.delete(id)
    return {"message": "Evento deletado com sucesso"}
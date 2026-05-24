from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.database.repositories.UserRepository import UserRepository
from app.services.UserService import UserService
from app.dtos.UserDto import UserRequest, UserResponse

router = APIRouter(prefix="/users", tags=["Users"])

def get_service(db: Session = Depends(get_db)):
    repository = UserRepository(db)
    return UserService(repository)

@router.get("/", response_model=list[UserResponse])
def find_all(service: UserService = Depends(get_service)):
    return service.find_all()

@router.get("/{id}", response_model=UserResponse)
def find_by_id(id: int, service: UserService = Depends(get_service)):
    return service.find_by_id(id)

@router.post("/create", response_model=UserResponse)
def create(request: UserRequest, service: UserService = Depends(get_service)):
    return service.create(
        nome=request.nome,
        matricula=request.matricula,
        senha=request.senha,
        roles=request.roles
    )

@router.delete("/{id}")
def delete(id: int, service: UserService = Depends(get_service)):
    service.delete(id)
    return {"message": "Usuario deletado com sucesso"}
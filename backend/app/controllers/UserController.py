from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.database.repositories.UserRepository import UserRepository
from app.services.UserService import UserService
from app.dtos.UserDto import AlunoRequest, CredenciadoRequest, UserResponse
from app.services.TokenService import get_current_user, require_credenciado

router = APIRouter(prefix="/users", tags=["Users"])

def get_service(db: Session = Depends(get_db)):
    repository = UserRepository(db)
    return UserService(repository)

@router.get("/", response_model=list[UserResponse])
def find_all(service: UserService = Depends(get_service), current_user = Depends(get_current_user)):
    return service.find_all()

@router.get("/{id}", response_model=UserResponse)
def find_by_id(id: int, service: UserService = Depends(get_service), current_user = Depends(get_current_user)):
    return service.find_by_id(id)

@router.post("/create/aluno", response_model=UserResponse)
def create_aluno(request: AlunoRequest, service: UserService = Depends(get_service)):
    return service.create_aluno(
        nome=request.nome,
        matricula=request.matricula,
        senha=request.senha,
        curso_id=request.curso_id
    )

@router.post("/create/credenciado", response_model=UserResponse)
def create_credenciado(request: CredenciadoRequest, service: UserService = Depends(get_service), current_user = Depends(require_credenciado)):
    return service.create_credenciado(
        nome=request.nome,
        matricula=request.matricula,
        senha=request.senha
    )

@router.delete("/{id}")
def delete(id: int, service: UserService = Depends(get_service), current_user = Depends(require_credenciado)):
    service.delete(id)
    return {"message": "Usuario deletado com sucesso"}
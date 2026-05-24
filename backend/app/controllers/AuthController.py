from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.database.repositories.UserRepository import UserRepository
from app.services.AuthService import AuthService
from pydantic import BaseModel

router = APIRouter(prefix="/auth", tags=["Auth"])

class LoginRequest(BaseModel):
    matricula: str
    senha: str

def get_service(db: Session = Depends(get_db)):
    repository = UserRepository(db)
    return AuthService(repository)

@router.post("/login")
def login(request: LoginRequest, service: AuthService = Depends(get_service)):
    result = service.login(request.matricula, request.senha)
    if not result:
        raise HTTPException(status_code=401, detail="Matricula ou senha invalidos")
    return result
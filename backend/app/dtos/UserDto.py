from pydantic import BaseModel
from app.database.models.UserEntity import RoleEnum
from typing import Optional

class AlunoRequest(BaseModel):
    nome: str
    matricula: str
    senha: str
    curso_id: int

class CredenciadoRequest(BaseModel):
    nome: str
    matricula: str
    senha: str

class UserResponse(BaseModel):
    id: int
    nome: str
    matricula: str
    roles: RoleEnum

    class Config:
        from_attributes = True
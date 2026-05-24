from pydantic import BaseModel
from app.database.models.UserEntity import RoleEnum

class UserRequest(BaseModel):
    nome: str
    matricula: str
    senha: str
    roles: RoleEnum

class UserResponse(BaseModel):
    id: int
    nome: str
    matricula: str
    roles: RoleEnum

    class Config:
        from_attributes = True
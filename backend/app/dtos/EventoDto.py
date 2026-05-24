from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class EventoRequest(BaseModel):
    nome: str
    descricao: Optional[str] = None
    local: Optional[str] = None
    palestrante: Optional[str] = None
    tipo: Optional[str] = None
    data: datetime
    hora_inicio: Optional[str] = None
    hora_fim: Optional[str] = None
    imagem: Optional[str] = None
    max_user: int

class EventoResponse(BaseModel):
    id: int
    nome: str
    descricao: Optional[str] = None
    local: Optional[str] = None
    palestrante: Optional[str] = None
    tipo: Optional[str] = None
    data: datetime
    hora_inicio: Optional[str] = None
    hora_fim: Optional[str] = None
    imagem: Optional[str] = None
    max_user: int

    class Config:
        from_attributes = True
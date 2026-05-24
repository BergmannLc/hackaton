from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List

class EventoRequest(BaseModel):
    nome: str
    descricao: Optional[str] = None
    local: Optional[str] = None
    palestrante: Optional[str] = None
    tipo: Optional[str] = None
    data: datetime
    hora_inicio: Optional[str] = None
    hora_fim: Optional[str] = None
    horas: Optional[int] = None
    imagem: Optional[str] = None
    max_user: int
    curso_ids: List[int] = Field(default_factory=list)

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
    horas: Optional[int] = None
    imagem: Optional[str] = None
    max_user: int

    class Config:
        from_attributes = True
from pydantic import BaseModel
from datetime import datetime

class EventoRequest(BaseModel):
    nome: str
    data: datetime
    max_user: int

class EventoResponse(BaseModel):
    id: int
    nome: str
    data: datetime
    max_user: int

    class Config:
        from_attributes = True
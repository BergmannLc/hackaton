from pydantic import BaseModel

class CursoRequest(BaseModel):
    nome: str

class CursoResponse(BaseModel):
    id: int
    nome: str

    class Config:
        from_attributes = True
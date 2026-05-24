from pydantic import BaseModel

class SugestaoRequest(BaseModel):
    nome: str
    descricao: str
    user_id: int

class SugestaoResponse(BaseModel):
    id: int
    nome: str
    descricao: str
    user_id: int
    status: str

    class Config:
        from_attributes = True
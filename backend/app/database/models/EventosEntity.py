from sqlalchemy import Column, Integer, String, DateTime
from app.database.db import Base

class Eventos(Base):
    __tablename__ = "eventos"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    descricao = Column(String, nullable=True)
    local = Column(String, nullable=True)
    palestrante = Column(String, nullable=True)
    tipo = Column(String, nullable=True)
    data = Column(DateTime, nullable=False)
    hora_inicio = Column(String, nullable=True)
    hora_fim = Column(String, nullable=True)
    horas = Column(Integer, nullable=True)
    imagem = Column(String, nullable=True)
    max_user = Column(Integer, nullable=False)
    qr_token = Column(String, nullable=True)
    qr_token_expiry = Column(DateTime, nullable=True)
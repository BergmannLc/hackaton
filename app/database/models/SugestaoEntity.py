from sqlalchemy import Column, Integer, String, ForeignKey
from app.database.db import Base

class Sugestao(Base):
    __tablename__ = "sugestao"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    descricao = Column(String, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(String, nullable=False)
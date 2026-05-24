from sqlalchemy import Column, Integer, String, ForeignKey

from app.database.db import Base


class Sugestao(Base):
    __tablename__ = 'sugestao'

    id = Column(Integer, primary_key=True, nullable=False)
    nome = Column(String, nullable=False)
    descricao = Column(String, nullable=False)
    user_id = Column(Integer, ForeignKey('User_Eventos.id'), nullable=False)
    status = Column(String, nullable=False)

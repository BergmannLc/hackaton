from sqlalchemy import Column, String, Integer

from app.database.db import Base


class Cursos(Base):
    __tablename__ = 'cursos'

    id = Column(Integer, primary_key=True)
    nome = Column(String, nullable=False)

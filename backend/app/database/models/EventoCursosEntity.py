from sqlalchemy import Column, Integer, ForeignKey
from app.database.db import Base


class EventoCursos(Base):
    __tablename__ = "evento_cursos"

    curso_id = Column(Integer, ForeignKey("cursos.id"), primary_key=True)
    evento_id = Column(Integer, ForeignKey("eventos.id"), primary_key=True)

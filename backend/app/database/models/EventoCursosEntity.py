from sqlalchemy import Column, Integer

from app.database.db import Base


class EventoCursos (Base):
    __tablename__ = 'evento_cursos'

    curso_id = Column(Integer, foreign_key='curso.id')
    evento_id = Column(Integer, foreign_key='evento.id')
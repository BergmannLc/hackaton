from sqlalchemy import Column, Integer

from app.database.db import Base


class UserCursos(Base):
    __tablename__ = 'UserCursos'
    user_id = Column(Integer, foreign_key='UserCursos.id')
    curso_id = Column(Integer, foreign_key='Cursos.id')


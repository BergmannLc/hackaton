from sqlalchemy import Column, Integer, ForeignKey
from app.database.db import Base


class UserCursos(Base):
    __tablename__ = 'UserCursos'
    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    curso_id = Column(Integer, ForeignKey("cursos.id"), primary_key=True)


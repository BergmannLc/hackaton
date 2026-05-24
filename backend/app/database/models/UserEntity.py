import enum
from enum import Enum
from sqlalchemy import Column, String

from app.database.db import Base

class RoleEnum(str, enum.Enum):
    aluno = "aluno"
    credenciado = "credenciado"


class User (Base):
    __tablename__ = 'user'
    id = Column(int, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    matricula = Column(String, nullable=False)
    roles = Column(Enum(RoleEnum), nullable=False)

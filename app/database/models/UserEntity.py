from sqlalchemy import Column, Integer, String
from sqlalchemy import Enum as SAEnum
import enum
from app.database.db import Base

class RoleEnum(str, enum.Enum):
    aluno = "aluno"
    credenciado = "credenciado"


class User (Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    matricula = Column(String, nullable=False)
    senha = Column(String, nullable=False)
    roles = Column(SAEnum(RoleEnum), nullable=False)

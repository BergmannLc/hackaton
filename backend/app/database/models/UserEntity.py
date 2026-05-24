from sqlalchemy import Column, Integer, String
from sqlalchemy import Enum as SAEnum
from app.database.db import Base
import enum

class RoleEnum(str, enum.Enum):
    aluno = "aluno"
    credenciado = "credenciado"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    matricula = Column(String, unique=True, nullable=False)
    senha = Column(String, nullable=False)
    roles = Column(SAEnum(RoleEnum), nullable=False)
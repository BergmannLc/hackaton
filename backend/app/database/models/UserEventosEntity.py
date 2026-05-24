from sqlalchemy import Column, Integer, ForeignKey, Boolean
from app.database.db import Base

class UserEventos(Base):
    __tablename__ = "user_eventos"

    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    evento_id = Column(Integer, ForeignKey("eventos.id"), primary_key=True)
    presenca = Column(Boolean, default=False, nullable=False)
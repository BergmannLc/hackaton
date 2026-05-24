from sqlalchemy import Column, Integer, String, DateTime
from app.database.db import Base

class Eventos(Base):
    __tablename__ = "eventos"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    data = Column(DateTime, nullable=False)
    max_user = Column(Integer, nullable=False)
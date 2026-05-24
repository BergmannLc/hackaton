from sqlalchemy import Column, Integer

from app.database.db import Base


class UserEventos(Base):
    __tablename__ = 'User_Eventos'
    user_id = Column(Integer, foreign_key='User_Eventos.id')
    evento_id = Column(Integer, foreign_key='User_Eventos.id')
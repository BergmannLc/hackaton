from sqlalchemy.orm import Session
from app.database.models.SugestaoEntity import Sugestao

class SugestaoRepository:

    def __init__(self, db: Session):
        self.db = db

    def find_all(self):
        return self.db.query(Sugestao).all()

    def find_by_id(self, id: int):
        return self.db.query(Sugestao).filter(Sugestao.id == id).first()

    def find_by_user_id(self, user_id: int):
        return self.db.query(Sugestao).filter(Sugestao.user_id == user_id).first()

    def save(self, sugestao: Sugestao):
        self.db.add(sugestao)
        self.db.commit()
        self.db.refresh(sugestao)
        return sugestao

    def delete(self, sugestao: Sugestao):
        self.db.delete(sugestao)
        self.db.commit()
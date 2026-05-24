from app.database.models.SugestaoEntity import Sugestao
from app.database.repositories.SugestaoRepository import SugestaoRepository

class SugestaoService:

    def __init__(self, repository: SugestaoRepository):
        self.repository = repository

    def find_all(self):
        return self.repository.find_all()

    def find_by_id(self, id: int):
        return self.repository.find_by_id(id)

    def create(self, nome: str, descricao: str, user_id: int):
        sugestao = Sugestao(
            nome=nome,
            descricao=descricao,
            user_id=user_id,
            status="pendente"
        )
        return self.repository.save(sugestao)

    def delete(self, id: int):
        sugestao = self.repository.find_by_id(id)
        if sugestao:
            self.repository.delete(sugestao)

    def update_status(self, id: int, status: str):
        sugestao = self.repository.find_by_id(id)
        if sugestao:
            sugestao.status = status
            return self.repository.save(sugestao)
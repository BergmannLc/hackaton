from app.database.models.UserEntity import User, RoleEnum
from app.database.repositories.UserRepository import UserRepository
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserService:

    def __init__(self, repository: UserRepository):
        self.repository = repository

    def find_all(self):
        return self.repository.find_all()

    def find_by_id(self, id: int):
        return self.repository.find_by_id(id)

    def create(self, nome: str, matricula: str, senha: str, roles: RoleEnum):
        hashed_senha = pwd_context.hash(senha)
        user = User(
            nome=nome,
            matricula=matricula,
            senha=hashed_senha,
            roles=roles
        )
        return self.repository.save(user)

    def delete(self, id: int):
        user = self.repository.find_by_id(id)
        if user:
            self.repository.delete(user)
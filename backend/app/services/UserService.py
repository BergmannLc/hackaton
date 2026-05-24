from app.database.models.UserEntity import User, RoleEnum
from app.database.models.UserCursosEntity import UserCursos
from app.database.repositories.UserRepository import UserRepository
import bcrypt

class UserService:

    def __init__(self, repository: UserRepository):
        self.repository = repository

    def find_all(self):
        return self.repository.find_all()

    def find_by_id(self, id: int):
        return self.repository.find_by_id(id)

    def create_aluno(self, nome: str, matricula: str, senha: str, curso_id: int):
        hashed_senha = bcrypt.hashpw(senha.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        user = User(
            nome=nome,
            matricula=matricula,
            senha=hashed_senha,
            roles=RoleEnum.aluno
        )
        saved_user = self.repository.save(user)
        user_curso = UserCursos(user_id=saved_user.id, curso_id=curso_id)
        self.repository.save_user_curso(user_curso)
        return saved_user

    def create_credenciado(self, nome: str, matricula: str, senha: str):
        hashed_senha = bcrypt.hashpw(senha.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        user = User(
            nome=nome,
            matricula=matricula,
            senha=hashed_senha,
            roles=RoleEnum.credenciado
        )
        return self.repository.save(user)

    def delete(self, id: int):
        user = self.repository.find_by_id(id)
        if user:
            self.repository.delete(user)
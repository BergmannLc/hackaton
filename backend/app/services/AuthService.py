from datetime import datetime, timedelta
from jose import JWTError, jwt
import bcrypt
from app.database.repositories.UserRepository import UserRepository
from dotenv import load_dotenv
import os

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

class AuthService:

    def __init__(self, repository: UserRepository):
        self.repository = repository

    def verify_password(self, plain_password: str, hashed_password: str):
        return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

    def create_access_token(self, data: dict):
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode.update({"exp": expire})
        return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    def login(self, matricula: str, senha: str):
        user = self.repository.find_by_matricula(matricula)
        if not user:
            return None
        if not self.verify_password(senha, user.senha):
            return None
        token = self.create_access_token({"sub": user.matricula, "roles": user.roles.value})
        return {"access_token": token, "token_type": "bearer"}
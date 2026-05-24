from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from dotenv import load_dotenv
import os

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        matricula: str = payload.get("sub")
        roles: str = payload.get("roles")
        if matricula is None:
            raise HTTPException(status_code=401, detail="Token invalido")
        return {"matricula": matricula, "roles": roles}
    except JWTError:
        raise HTTPException(status_code=401, detail="Token invalido")

def require_credenciado(current_user: dict = Depends(get_current_user)):
    if current_user["roles"] != "credenciado":
        raise HTTPException(status_code=403, detail="Apenas credenciados podem acessar essa rota")
    return current_user

def require_aluno(current_user: dict = Depends(get_current_user)):
    if current_user["roles"] != "aluno":
        raise HTTPException(status_code=403, detail="Apenas alunos podem acessar essa rota")
    return current_user
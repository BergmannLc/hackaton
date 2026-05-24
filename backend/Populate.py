import os
os.environ['PGCLIENTENCODING'] = 'utf8'
os.environ['LC_ALL'] = 'C'
os.environ['LANG'] = 'C'

import bcrypt
from app.database.db import SessionLocal
from app.database.models.UserEntity import User, RoleEnum
from app.database.models.Cursos import Cursos

def create_admin():
    db = SessionLocal()
    try:
        admin = User(
            nome="Admin",
            matricula="admin",
            senha=bcrypt.hashpw("admin123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
            roles=RoleEnum.credenciado
        )
        db.add(admin)
        db.commit()
        print("Admin criado com sucesso!")
    finally:
        db.close()

def create_cursos():
    db = SessionLocal()
    try:
        cursos = [
            "Engenharia de Software",
            "Engenharia Civil",
            "Sistema da informação",
            "Nutrição",
            "Biomedicina"
            "Design",
            "Engenharia mecanica",
        ]
        for nome in cursos:
            curso = Cursos(nome=nome)
            db.add(curso)
        db.commit()
        print("Cursos criados com sucesso!")
    finally:
        db.close()

if __name__ == "__main__":
    create_cursos()
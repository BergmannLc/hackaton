import os
os.environ['PGCLIENTENCODING'] = 'utf8'
os.environ['LC_ALL'] = 'C'
os.environ['LANG'] = 'C'

import bcrypt
from app.database.db import SessionLocal
from app.database.models.UserEntity import User, RoleEnum

def create_admin():
    db = SessionLocal()
    try:
        hashed_senha = bcrypt.hashpw("admin123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        admin = User(
            nome="Admin",
            matricula="admin",
            senha=hashed_senha,
            roles=RoleEnum.credenciado
        )
        db.add(admin)
        db.commit()
        print("Admin criado com sucesso!")
    finally:
        db.close()

if __name__ == "__main__":
    create_admin()
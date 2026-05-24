import os
os.environ['PGCLIENTENCODING'] = 'utf8'
os.environ['LC_ALL'] = 'C'
os.environ['LANG'] = 'C'

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.db import engine, Base
from app.controllers.UserController import router as user_router
from app.controllers.EventoController import router as evento_router
from app.controllers.CursoController import router as curso_router
from app.controllers.SugestaoController import router as sugestao_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(engine)

app.include_router(user_router)
app.include_router(evento_router)
app.include_router(curso_router)
app.include_router(sugestao_router)
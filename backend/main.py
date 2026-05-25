import os
os.environ['PGCLIENTENCODING'] = 'utf8'
os.environ['LC_ALL'] = 'C'
os.environ['LANG'] = 'C'

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.db import engine, Base
from app.database.models import (
    User,
    Eventos,
    Cursos,
    UserCursos,
    UserEventos,
    EventoCursos,
    Sugestao,
)

from app.controllers.UserController import router as user_router
from app.controllers.EventoController import router as evento_router
from app.controllers.CursoController import router as curso_router
from app.controllers.SugestaoController import router as sugestao_router
from app.controllers.AuthController import router as auth_router
from app.controllers.InscricaoController import router as inscricao_router
from app.controllers.QrCodeController import router as qrcode_router


app = FastAPI(
    title="FlowUp API",
    description="API do sistema FlowUp -- eventos academicos, horas complementares e Hub de cursos.",
    version="0.1.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


Base.metadata.create_all(bind=engine)


app.include_router(auth_router)
app.include_router(user_router)
app.include_router(curso_router)
app.include_router(evento_router)
app.include_router(sugestao_router)
app.include_router(inscricao_router)
app.include_router(qrcode_router)


@app.get("/", tags=["Health"])
def health_check():
    return {"status": "ok", "service": "FlowUp API", "version": "0.1.0"}

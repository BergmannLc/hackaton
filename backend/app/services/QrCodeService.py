import qrcode
import secrets
import io
import base64
from datetime import datetime, timedelta
from fastapi import HTTPException
from app.database.repositories.EventoRepository import EventoRepository
from app.database.repositories.UserEventosRepository import UserEventosRepository

class QrCodeService:

    def __init__(self, evento_repository: EventoRepository, user_eventos_repository: UserEventosRepository):
        self.evento_repository = evento_repository
        self.user_eventos_repository = user_eventos_repository

    def gerar_qrcode(self, evento_id: int):
        evento = self.evento_repository.find_by_id(evento_id)
        if not evento:
            raise HTTPException(status_code=404, detail="Evento nao encontrado")

        token = secrets.token_urlsafe(32)
        expiry = datetime.utcnow() + timedelta(seconds=30)

        evento.qr_token = token
        evento.qr_token_expiry = expiry
        self.evento_repository.save(evento)

        qr = qrcode.QRCode(version=1, box_size=10, border=5)
        qr.add_data(token)
        qr.make(fit=True)
        img = qr.make_image(fill_color="black", back_color="white")

        buffer = io.BytesIO()
        img.save(buffer, format="PNG")
        buffer.seek(0)
        img_base64 = base64.b64encode(buffer.getvalue()).decode("utf-8")

        return {"qr_code": img_base64, "token": token, "expiry": expiry}

    def confirmar_presenca_qrcode(self, user_id: int, evento_id: int, token: str):
        evento = self.evento_repository.find_by_id(evento_id)
        if not evento:
            raise HTTPException(status_code=404, detail="Evento nao encontrado")

        if evento.qr_token != token:
            raise HTTPException(status_code=400, detail="QR Code invalido")

        if datetime.utcnow() > evento.qr_token_expiry:
            raise HTTPException(status_code=400, detail="QR Code expirado")

        return self.user_eventos_repository.update_presenca(user_id, evento_id, True)
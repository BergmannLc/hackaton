import api from '../services/api';

/**
 * Unified API Client for frontend communication with FastAPI backend.
 *
 * Each namespace maps directly to a controller in backend/app/controllers/.
 * Update routes (PATCH) are NOT included for entities where the backend
 * doesn't expose them yet -- only the routes that actually exist.
 */
export const apiClient = {
  /**
   * AuthController -- backend/app/controllers/AuthController.py
   * POST /auth/login -> { matricula, senha } returns { access_token, token_type }
   */
  auth: {
    login: (credentials) => api.post('/auth/login', credentials),
  },

  /**
   * UserController -- backend/app/controllers/UserController.py
   * Two distinct creation endpoints: aluno (public) and credenciado (restricted).
   */
  users: {
    getAll: () => api.get('/users/'),
    getById: (id) => api.get(`/users/${id}`),
    createAluno: (data) => api.post('/users/create/aluno', data),
    createCredenciado: (data) => api.post('/users/create/credenciado', data),
    delete: (id) => api.delete(`/users/${id}`),
  },

  /**
   * EventoController -- backend/app/controllers/EventoController.py
   */
  eventos: {
    getAll: () => api.get('/eventos/'),
    getById: (id) => api.get(`/eventos/${id}`),
    create: (data) => api.post('/eventos/create', data),
    delete: (id) => api.delete(`/eventos/${id}`),
  },

  /**
   * CursoController -- backend/app/controllers/CursoController.py
   */
  cursos: {
    getAll: () => api.get('/cursos/'),
    getById: (id) => api.get(`/cursos/${id}`),
    create: (data) => api.post('/cursos/create', data),
    delete: (id) => api.delete(`/cursos/${id}`),
  },

  /**
   * SugestaoController -- backend/app/controllers/SugestaoController.py
   * Status update sends `status` as query param (PATCH /sugestoes/{id}/status?status=...)
   */
  sugestoes: {
    getAll: () => api.get('/sugestoes/'),
    getById: (id) => api.get(`/sugestoes/${id}`),
    create: (data) => api.post('/sugestoes/create', data),
    delete: (id) => api.delete(`/sugestoes/${id}`),
    updateStatus: (id, status) =>
      api.patch(`/sugestoes/${id}/status`, null, { params: { status } }),
  },

  /**
   * InscricaoController -- backend/app/controllers/InscricaoController.py
   * The student's user id is resolved from the JWT on the server side,
   * so `inscrever` and `desinscrever` don't take a user id from the client.
   * `confirmarPresenca` sends `presenca` as query param.
   */
  inscricoes: {
    inscrever: (eventoId) =>
      api.post(`/inscricoes/eventos/${eventoId}/inscrever`),
    desinscrever: (eventoId) =>
      api.delete(`/inscricoes/eventos/${eventoId}/desinscrever`),
    getInscritos: (eventoId) =>
      api.get(`/inscricoes/eventos/${eventoId}/inscritos`),
    confirmarPresenca: (eventoId, userId, presenca) =>
      api.patch(
        `/inscricoes/eventos/${eventoId}/presenca/${userId}`,
        null,
        { params: { presenca } }
      ),
  },

  /**
   * QrCodeController -- backend/app/controllers/QrCodeController.py
   * `gerar` returns { qr_code (base64 PNG), token, expiry }.
   * `confirmar` sends `token` as query param; student id resolved from JWT.
   */
  qrcode: {
    gerar: (eventoId) => api.get(`/qrcode/eventos/${eventoId}/gerar`),
    confirmar: (eventoId, token) =>
      api.post(
        `/qrcode/eventos/${eventoId}/confirmar`,
        null,
        { params: { token } }
      ),
  },
};

export default apiClient;

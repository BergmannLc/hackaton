import api from '../services/api';

// Cliente HTTP que centraliza as rotas da API.
// Cada namespace agrupa as chamadas de um controller.
export const apiClient = {
  auth: {
    login: (credentials) => api.post('/auth/login', credentials),
  },

  users: {
    getAll: () => api.get('/users/'),
    getById: (id) => api.get(`/users/${id}`),
    createAluno: (data) => api.post('/users/create/aluno', data),
    createCredenciado: (data) => api.post('/users/create/credenciado', data),
    delete: (id) => api.delete(`/users/${id}`),
  },

  eventos: {
    getAll: () => api.get('/eventos/'),
    getById: (id) => api.get(`/eventos/${id}`),
    create: (data) => api.post('/eventos/create', data),
    delete: (id) => api.delete(`/eventos/${id}`),
  },

  cursos: {
    getAll: () => api.get('/cursos/'),
    getById: (id) => api.get(`/cursos/${id}`),
    create: (data) => api.post('/cursos/create', data),
    delete: (id) => api.delete(`/cursos/${id}`),
  },

  sugestoes: {
    getAll: () => api.get('/sugestoes/'),
    getById: (id) => api.get(`/sugestoes/${id}`),
    create: (data) => api.post('/sugestoes/create', data),
    delete: (id) => api.delete(`/sugestoes/${id}`),
    updateStatus: (id, status) =>
      api.patch(`/sugestoes/${id}/status`, null, { params: { status } }),
  },

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

import api from '../services/api';

/**
 * Unified API Client for frontend communication with FastAPI backend.
 */
export const apiClient = {
  cursos: {
    getAll: () => api.get('/cursos/'),
    getById: (id) => api.get(`/cursos/${id}`),
    create: (data) => api.post('/cursos/create', data),
    delete: (id) => api.delete(`/cursos/${id}`),
    update: (id, data) => api.patch(`/cursos/${id}`, data),
  },
  eventos: {
    getAll: () => api.get('/eventos/'),
    getById: (id) => api.get(`/eventos/${id}`),
    create: (data) => api.post('/eventos/create', data),
    delete: (id) => api.delete(`/eventos/${id}`),
    update: (id, data) => api.patch(`/eventos/${id}`, data),
  },
  sugestoes: {
    getAll: () => api.get('/sugestoes/'),
    getById: (id) => api.get(`/sugestoes/${id}`),
    create: (data) => api.post('/sugestoes/create', data),
    delete: (id) => api.delete(`/sugestoes/${id}`),
    updateStatus: (id, status) => api.patch(`/sugestoes/${id}/status`, null, { params: { status } }),
    update: (id, data) => api.patch(`/sugestoes/${id}`, data),
  },
  users: {
    getAll: () => api.get('/users/'),
    getById: (id) => api.get(`/users/${id}`),
    create: (data) => api.post('/users/create', data),
    delete: (id) => api.delete(`/users/${id}`),
    update: (id, data) => api.patch(`/users/${id}`, data),
  }
};

export default apiClient;

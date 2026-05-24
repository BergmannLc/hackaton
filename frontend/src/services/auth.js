import { MOCK_USER, MOCK_PROF } from './mocks';

// Quando o backend estiver pronto, troque para:
// import api from './api';
// export const login = async (email, password) => await api.post('/login', { email, password });

export const login = async (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === 'admin@flowup.com') {
        resolve({ data: { token: 'fake-jwt-token-admin', user: MOCK_PROF } });
      } else if (email) {
        resolve({ data: { token: 'fake-jwt-token-student', user: MOCK_USER } });
      } else {
        reject(new Error('E-mail obrigatório'));
      }
    }, 800);
  });
};

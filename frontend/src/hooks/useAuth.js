import { useState, useCallback, useEffect } from 'react';
import apiClient from '../lib/api';
import toast from 'react-hot-toast';

const TOKEN_KEY = '@FlowUp:token';

function decodificarJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;
    const payload = decodificarJwt(token);
    if (!payload?.sub) return null;
    return { matricula: payload.sub, roles: payload.roles };
  });

  useEffect(() => {
    const aoMudarStorage = (e) => {
      if (e.key !== TOKEN_KEY) return;
      if (!e.newValue) {
        setCurrentUser(null);
        return;
      }
      const payload = decodificarJwt(e.newValue);
      setCurrentUser(payload?.sub ? { matricula: payload.sub, roles: payload.roles } : null);
    };
    window.addEventListener('storage', aoMudarStorage);
    return () => window.removeEventListener('storage', aoMudarStorage);
  }, []);

  const handleError = useCallback((err) => {
    const msg = err.response?.data?.detail || err.message || 'Erro ao autenticar.';
    setError(msg);
    toast.error(msg);
    throw err;
  }, []);

  const login = useCallback(async (credentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.auth.login(credentials);
      const { access_token } = response.data;
      if (!access_token) throw new Error('Resposta de login invalida (token ausente).');
      localStorage.setItem(TOKEN_KEY, access_token);
      const payload = decodificarJwt(access_token);
      const user = payload?.sub ? { matricula: payload.sub, roles: payload.roles } : null;
      setCurrentUser(user);
      toast.success('Login realizado com sucesso!');
      return { token: access_token, user };
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setCurrentUser(null);
    toast('Voce saiu da conta.', { icon: '👋' });
  }, []);

  return {
    currentUser,
    isAuthenticated: currentUser !== null,
    isCredenciado: currentUser?.roles === 'credenciado',
    isAluno: currentUser?.roles === 'aluno',
    isLoading,
    error,
    login,
    logout,
  };
}

export default useAuth;

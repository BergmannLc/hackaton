import { useState, useCallback, useEffect } from 'react';
import apiClient from '../lib/api';
import toast from 'react-hot-toast';

const TOKEN_KEY = '@FlowUp:token';

/**
 * Decodes the payload of a JWT without verifying the signature.
 * Server still validates everything on protected routes — this is only
 * used by the UI to read `sub` (matricula) and `roles` from the token.
 *
 * @param {string} token
 * @returns {{ sub?: string, roles?: string, exp?: number } | null}
 */
function decodeJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

/**
 * Custom hook for authentication against the FastAPI backend.
 *
 * Backend reference:
 *   POST /auth/login → body { matricula, senha } → { access_token, token_type }
 *
 * The bearer token is persisted in localStorage under '@FlowUp:token' so the
 * axios interceptor in services/api.js can attach it to every subsequent request.
 */
export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;
    const payload = decodeJwt(token);
    if (!payload?.sub) return null;
    return { matricula: payload.sub, roles: payload.roles };
  });

  // Keep `currentUser` in sync if the token is set/cleared elsewhere
  // (other tabs, manual localStorage edits, etc.)
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== TOKEN_KEY) return;
      if (!e.newValue) {
        setCurrentUser(null);
        return;
      }
      const payload = decodeJwt(e.newValue);
      setCurrentUser(payload?.sub ? { matricula: payload.sub, roles: payload.roles } : null);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const handleError = useCallback((err) => {
    const errorMessage =
      err.response?.data?.detail || err.message || 'Erro ao autenticar.';
    setError(errorMessage);
    toast.error(errorMessage);
    throw err;
  }, []);

  /**
   * POST /auth/login
   * @param {{ matricula: string, senha: string }} credentials
   */
  const login = useCallback(async (credentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.auth.login(credentials);
      const { access_token } = response.data;
      if (!access_token) {
        throw new Error('Resposta de login inválida (token ausente).');
      }
      localStorage.setItem(TOKEN_KEY, access_token);
      const payload = decodeJwt(access_token);
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

  /** Clears local credentials. Backend has no logout endpoint — JWT is stateless. */
  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setCurrentUser(null);
    toast('Você saiu da conta.', { icon: '👋' });
  }, []);

  const isAuthenticated = currentUser !== null;
  const isCredenciado = currentUser?.roles === 'credenciado';
  const isAluno = currentUser?.roles === 'aluno';

  return {
    currentUser,
    isAuthenticated,
    isCredenciado,
    isAluno,
    isLoading,
    error,
    login,
    logout,
  };
}

export default useAuth;

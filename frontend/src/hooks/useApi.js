import { useState, useCallback } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

/**
 * Custom hook para facilitar a comunicação com o Backend FastAPI.
 * Ele gerencia automaticamente o estado de loading (carregamento) 
 * e exibe as mensagens de erro caso a requisição falhe.
 */
export function useApi() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (method, url, data = null, options = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api({
        method,
        url,
        data,
        ...options,
      });
      return response.data;
    } catch (err) {
      // O FastAPI costuma enviar a mensagem de erro dentro de err.response.data.detail
      const errorMessage = err.response?.data?.detail || err.message || 'Erro inesperado no servidor.';
      setError(errorMessage);
      toast.error(errorMessage); // Já mostra um Toast vermelho lindo pro usuário!
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const get = useCallback((url, options) => request('get', url, null, options), [request]);
  const post = useCallback((url, data, options) => request('post', url, data, options), [request]);
  const put = useCallback((url, data, options) => request('put', url, data, options), [request]);
  const del = useCallback((url, options) => request('delete', url, null, options), [request]);

  return { request, get, post, put, del, isLoading, error };
}

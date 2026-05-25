import { useState, useCallback } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

// Hook generico para chamadas HTTP. Cuida de loading, erro e toast automatico.
export function useApi() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (method, url, data = null, options = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api({ method, url, data, ...options });
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Erro inesperado.';
      setError(msg);
      toast.error(msg);
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

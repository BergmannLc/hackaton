import { useState, useCallback } from 'react';
import apiClient from '../lib/api';
import toast from 'react-hot-toast';

export function useInscricao() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inscritos, setInscritos] = useState([]);

  const handleError = useCallback((err) => {
    const msg = err.response?.data?.detail || err.message || 'Erro ao processar inscricao.';
    setError(msg);
    toast.error(msg);
    throw err;
  }, []);

  const inscrever = useCallback(async (eventoId) => {
    setIsLoading(true); setError(null);
    try {
      const response = await apiClient.inscricoes.inscrever(eventoId);
      toast.success('Inscricao confirmada!');
      return response.data;
    } catch (err) { handleError(err); } finally { setIsLoading(false); }
  }, [handleError]);

  const desinscrever = useCallback(async (eventoId) => {
    setIsLoading(true); setError(null);
    try {
      const response = await apiClient.inscricoes.desinscrever(eventoId);
      toast.success('Inscricao cancelada.');
      return response.data;
    } catch (err) { handleError(err); } finally { setIsLoading(false); }
  }, [handleError]);

  const fetchInscritos = useCallback(async (eventoId) => {
    setIsLoading(true); setError(null);
    try {
      const response = await apiClient.inscricoes.getInscritos(eventoId);
      setInscritos(response.data);
      return response.data;
    } catch (err) { handleError(err); } finally { setIsLoading(false); }
  }, [handleError]);

  const confirmarPresencaManual = useCallback(async (eventoId, userId, presenca) => {
    setIsLoading(true); setError(null);
    try {
      const response = await apiClient.inscricoes.confirmarPresenca(eventoId, userId, presenca);
      toast.success(presenca ? 'Presenca marcada.' : 'Presenca removida.');
      return response.data;
    } catch (err) { handleError(err); } finally { setIsLoading(false); }
  }, [handleError]);

  return { inscritos, isLoading, error, inscrever, desinscrever, fetchInscritos, confirmarPresencaManual };
}

export default useInscricao;

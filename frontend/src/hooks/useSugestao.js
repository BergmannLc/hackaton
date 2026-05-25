import { useState, useCallback } from 'react';
import apiClient from '../lib/api';
import SugestaoFactory from '../factories/SugestaoFactory';
import toast from 'react-hot-toast';

export function useSugestao() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sugestoes, setSugestoes] = useState([]);
  const [sugestao, setSugestao] = useState(null);

  const handleError = useCallback((err) => {
    const msg = err.response?.data?.detail || err.message || 'Erro ao processar sugestao.';
    setError(msg);
    toast.error(msg);
    throw err;
  }, []);

  const fetchSugestoes = useCallback(async () => {
    setIsLoading(true); setError(null);
    try {
      const response = await apiClient.sugestoes.getAll();
      setSugestoes(response.data);
      return response.data;
    } catch (err) { handleError(err); } finally { setIsLoading(false); }
  }, [handleError]);

  const fetchSugestaoById = useCallback(async (id) => {
    setIsLoading(true); setError(null);
    try {
      const response = await apiClient.sugestoes.getById(id);
      setSugestao(response.data);
      return response.data;
    } catch (err) { handleError(err); } finally { setIsLoading(false); }
  }, [handleError]);

  const createSugestao = useCallback(async (formData) => {
    setIsLoading(true); setError(null);
    try {
      const payload = SugestaoFactory.buildSugestaoForCreate(formData);
      const response = await apiClient.sugestoes.create(payload);
      toast.success('Sugestao enviada com sucesso!');
      return response.data;
    } catch (err) { handleError(err); } finally { setIsLoading(false); }
  }, [handleError]);

  const updateSugestaoStatus = useCallback(async (id, status) => {
    setIsLoading(true); setError(null);
    try {
      const response = await apiClient.sugestoes.updateStatus(id, status);
      toast.success(status === 'aprovada' ? 'Sugestao aprovada!' : 'Sugestao atualizada!');
      return response.data;
    } catch (err) { handleError(err); } finally { setIsLoading(false); }
  }, [handleError]);

  const deleteSugestao = useCallback(async (id) => {
    setIsLoading(true); setError(null);
    try {
      const response = await apiClient.sugestoes.delete(id);
      toast.success('Sugestao excluida!');
      return response.data;
    } catch (err) { handleError(err); } finally { setIsLoading(false); }
  }, [handleError]);

  return { sugestoes, sugestao, isLoading, error, fetchSugestoes, fetchSugestaoById, createSugestao, updateSugestaoStatus, deleteSugestao };
}

export default useSugestao;

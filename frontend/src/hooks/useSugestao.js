import { useState, useCallback } from 'react';
import apiClient from '../lib/api';
import SugestaoFactory from '../factories/SugestaoFactory';
import toast from 'react-hot-toast';

/**
 * Custom hook for Sugestao operations (list, get, create, delete, updateStatus).
 * Backend exposes only PATCH /sugestoes/{id}/status -- there is no generic
 * PATCH /sugestoes/{id}, so a full update is not provided.
 */
export function useSugestao() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sugestoes, setSugestoes] = useState([]);
  const [sugestao, setSugestao] = useState(null);

  const handleError = useCallback((err) => {
    const errorMessage =
      err.response?.data?.detail || err.message || 'Erro ao processar requisicao da sugestao.';
    setError(errorMessage);
    toast.error(errorMessage);
    throw err;
  }, []);

  /** GET /sugestoes/  (requires JWT) */
  const fetchSugestoes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.sugestoes.getAll();
      setSugestoes(response.data);
      return response.data;
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  /** GET /sugestoes/{id}  (requires JWT) */
  const fetchSugestaoById = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.sugestoes.getById(id);
      setSugestao(response.data);
      return response.data;
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  /** POST /sugestoes/create  (requires aluno JWT) */
  const createSugestao = useCallback(async (formData) => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = SugestaoFactory.buildSugestaoForCreate(formData);
      const response = await apiClient.sugestoes.create(payload);
      toast.success('Sugestao enviada com sucesso!');
      return response.data;
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  /**
   * PATCH /sugestoes/{id}/status?status=...  (requires credenciado JWT)
   * @param {number} id
   * @param {"pendente" | "aprovada"} status
   */
  const updateSugestaoStatus = useCallback(async (id, status) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.sugestoes.updateStatus(id, status);
      toast.success(`Sugestao foi ${status === 'aprovada' ? 'aprovada' : 'atualizada'}!`);
      return response.data;
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  /** DELETE /sugestoes/{id}  (requires JWT) */
  const deleteSugestao = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.sugestoes.delete(id);
      toast.success('Sugestao excluida com sucesso!');
      return response.data;
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  return {
    sugestoes,
    sugestao,
    isLoading,
    error,
    fetchSugestoes,
    fetchSugestaoById,
    createSugestao,
    updateSugestaoStatus,
    deleteSugestao,
  };
}

export default useSugestao;

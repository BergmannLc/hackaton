import { useState, useCallback } from 'react';
import apiClient from '../lib/api';
import SugestaoFactory from '../factories/SugestaoFactory';
import toast from 'react-hot-toast';

/**
 * Custom hook for Sugestao CRUD operations.
 * Handles loading states, errors, API requests, and maps data via SugestaoFactory.
 */
export function useSugestao() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sugestoes, setSugestoes] = useState([]);
  const [sugestao, setSugestao] = useState(null);

  /**
   * Safe wrapper to handle request errors.
   */
  const handleError = useCallback((err) => {
    const errorMessage = err.response?.data?.detail || err.message || 'Erro ao processar requisição da sugestão.';
    setError(errorMessage);
    toast.error(errorMessage);
    throw err;
  }, []);

  /**
   * Fetches all suggestions.
   * 
   * @returns {Promise<import('../factories/SugestaoFactory').SugestaoResponse[]>}
   */
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

  /**
   * Fetches a single suggestion by ID.
   * 
   * @param {number} id - Suggestion ID.
   * @returns {Promise<import('../factories/SugestaoFactory').SugestaoResponse>}
   */
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

  /**
   * Creates a new suggestion. Maps data with SugestaoFactory.
   * 
   * @param {import('../factories/SugestaoFactory').SugestaoFormData} formData - Form data from frontend.
   * @returns {Promise<import('../factories/SugestaoFactory').SugestaoResponse>}
   */
  const createSugestao = useCallback(async (formData) => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = SugestaoFactory.buildSugestaoForCreate(formData);
      const response = await apiClient.sugestoes.create(payload);
      toast.success('Sugestão enviada com sucesso!');
      return response.data;
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  /**
   * Updates an existing suggestion. Maps data with SugestaoFactory.
   * 
   * @param {number} id - Suggestion ID to update.
   * @param {import('../factories/SugestaoFactory').SugestaoFormData} formData - Form data to update.
   * @returns {Promise<import('../factories/SugestaoFactory').SugestaoResponse>}
   */
  const updateSugestao = useCallback(async (id, formData) => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = SugestaoFactory.buildSugestaoForUpdate(formData);
      const response = await apiClient.sugestoes.update(id, payload);
      toast.success('Sugestão atualizada com sucesso!');
      return response.data;
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  /**
   * Updates suggestion status specifically (e.g. approve/reject).
   * 
   * @param {number} id - Suggestion ID.
   * @param {"pendente" | "aprovada"} status - Next status.
   * @returns {Promise<import('../factories/SugestaoFactory').SugestaoResponse>}
   */
  const updateSugestaoStatus = useCallback(async (id, status) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.sugestoes.updateStatus(id, status);
      toast.success(`Sugestão foi ${status === 'aprovada' ? 'aprovada' : 'atualizada'}!`);
      return response.data;
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  /**
   * Deletes a suggestion.
   * 
   * @param {number} id - Suggestion ID.
   * @returns {Promise<{message: string}>}
   */
  const deleteSugestao = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.sugestoes.delete(id);
      toast.success('Sugestão excluída com sucesso!');
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
    updateSugestao,
    updateSugestaoStatus,
    deleteSugestao
  };
}

export default useSugestao;

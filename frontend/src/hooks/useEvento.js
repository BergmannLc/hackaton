import { useState, useCallback } from 'react';
import apiClient from '../lib/api';
import EventoFactory from '../factories/EventoFactory';
import toast from 'react-hot-toast';

/**
 * Custom hook for Evento CRUD operations.
 * Handles loading states, errors, API requests, and maps data via EventoFactory.
 */
export function useEvento() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [eventos, setEventos] = useState([]);
  const [evento, setEvento] = useState(null);

  /**
   * Safe wrapper to handle request errors.
   */
  const handleError = useCallback((err) => {
    const errorMessage = err.response?.data?.detail || err.message || 'Erro ao processar requisição do evento.';
    setError(errorMessage);
    toast.error(errorMessage);
    throw err;
  }, []);

  /**
   * Fetches all events.
   * 
   * @returns {Promise<import('../factories/EventoFactory').EventoResponse[]>}
   */
  const fetchEventos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.eventos.getAll();
      setEventos(response.data);
      return response.data;
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  /**
   * Fetches a single event by ID.
   * 
   * @param {number} id - Event ID.
   * @returns {Promise<import('../factories/EventoFactory').EventoResponse>}
   */
  const fetchEventoById = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.eventos.getById(id);
      setEvento(response.data);
      return response.data;
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  /**
   * Creates a new event. Maps data with EventoFactory.
   * 
   * @param {import('../factories/EventoFactory').EventoFormData} formData - Form data from frontend.
   * @returns {Promise<import('../factories/EventoFactory').EventoResponse>}
   */
  const createEvento = useCallback(async (formData) => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = EventoFactory.buildEventoForCreate(formData);
      const response = await apiClient.eventos.create(payload);
      toast.success('Evento criado com sucesso!');
      return response.data;
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  /**
   * Updates an existing event. Maps data with EventoFactory.
   * 
   * @param {number} id - Event ID to update.
   * @param {import('../factories/EventoFactory').EventoFormData} formData - Form data to update.
   * @returns {Promise<import('../factories/EventoFactory').EventoResponse>}
   */
  const updateEvento = useCallback(async (id, formData) => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = EventoFactory.buildEventoForUpdate(formData);
      const response = await apiClient.eventos.update(id, payload);
      toast.success('Evento atualizado com sucesso!');
      return response.data;
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  /**
   * Deletes an event.
   * 
   * @param {number} id - Event ID.
   * @returns {Promise<{message: string}>}
   */
  const deleteEvento = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.eventos.delete(id);
      toast.success('Evento excluído com sucesso!');
      return response.data;
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  return {
    eventos,
    evento,
    isLoading,
    error,
    fetchEventos,
    fetchEventoById,
    createEvento,
    updateEvento,
    deleteEvento
  };
}

export default useEvento;

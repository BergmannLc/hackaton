import { useState, useCallback } from 'react';
import apiClient from '../lib/api';
import EventoFactory from '../factories/EventoFactory';
import toast from 'react-hot-toast';

export function useEvento() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [eventos, setEventos] = useState([]);
  const [evento, setEvento] = useState(null);

  const handleError = useCallback((err) => {
    const msg = err.response?.data?.detail || err.message || 'Erro ao processar evento.';
    setError(msg);
    toast.error(msg);
    throw err;
  }, []);

  const fetchEventos = useCallback(async () => {
    setIsLoading(true); setError(null);
    try {
      const response = await apiClient.eventos.getAll();
      setEventos(response.data);
      return response.data;
    } catch (err) { handleError(err); } finally { setIsLoading(false); }
  }, [handleError]);

  const fetchEventoById = useCallback(async (id) => {
    setIsLoading(true); setError(null);
    try {
      const response = await apiClient.eventos.getById(id);
      setEvento(response.data);
      return response.data;
    } catch (err) { handleError(err); } finally { setIsLoading(false); }
  }, [handleError]);

  const createEvento = useCallback(async (formData) => {
    setIsLoading(true); setError(null);
    try {
      const payload = EventoFactory.buildEventoForCreate(formData);
      const response = await apiClient.eventos.create(payload);
      toast.success('Evento criado com sucesso!');
      return response.data;
    } catch (err) { handleError(err); } finally { setIsLoading(false); }
  }, [handleError]);

  const deleteEvento = useCallback(async (id) => {
    setIsLoading(true); setError(null);
    try {
      const response = await apiClient.eventos.delete(id);
      toast.success('Evento excluido com sucesso!');
      return response.data;
    } catch (err) { handleError(err); } finally { setIsLoading(false); }
  }, [handleError]);

  return { eventos, evento, isLoading, error, fetchEventos, fetchEventoById, createEvento, deleteEvento };
}

export default useEvento;

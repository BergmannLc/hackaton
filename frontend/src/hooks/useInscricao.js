import { useState, useCallback } from 'react';
import apiClient from '../lib/api';
import toast from 'react-hot-toast';

/**
 * Custom hook for inscrição (event enrollment) operations.
 *
 * Backend reference — backend/app/controllers/InscricaoController.py
 *   POST   /inscricoes/eventos/{evento_id}/inscrever            (aluno)
 *   DELETE /inscricoes/eventos/{evento_id}/desinscrever         (aluno)
 *   GET    /inscricoes/eventos/{evento_id}/inscritos            (credenciado)
 *   PATCH  /inscricoes/eventos/{evento_id}/presenca/{user_id}?presenca=true|false  (credenciado)
 *
 * The aluno's user id is resolved from the JWT on the server, so the
 * inscrever/desinscrever functions don't take a user id from the client.
 */
export function useInscricao() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inscritos, setInscritos] = useState([]);

  const handleError = useCallback((err) => {
    const errorMessage =
      err.response?.data?.detail || err.message || 'Erro ao processar inscrição.';
    setError(errorMessage);
    toast.error(errorMessage);
    throw err;
  }, []);

  /** POST /inscricoes/eventos/{eventoId}/inscrever  (requires aluno JWT) */
  const inscrever = useCallback(async (eventoId) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.inscricoes.inscrever(eventoId);
      toast.success('Inscrição confirmada!');
      return response.data;
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  /** DELETE /inscricoes/eventos/{eventoId}/desinscrever  (requires aluno JWT) */
  const desinscrever = useCallback(async (eventoId) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.inscricoes.desinscrever(eventoId);
      toast.success('Inscrição cancelada.');
      return response.data;
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  /** GET /inscricoes/eventos/{eventoId}/inscritos  (requires credenciado JWT) */
  const fetchInscritos = useCallback(async (eventoId) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.inscricoes.getInscritos(eventoId);
      setInscritos(response.data);
      return response.data;
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  /**
   * PATCH /inscricoes/eventos/{eventoId}/presenca/{userId}?presenca=true|false
   * (requires credenciado JWT) — manual attendance toggle.
   *
   * @param {number}  eventoId
   * @param {number}  userId
   * @param {boolean} presenca
   */
  const confirmarPresencaManual = useCallback(async (eventoId, userId, presenca) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.inscricoes.confirmarPresenca(eventoId, userId, presenca);
      toast.success(
        presenca ? 'Presença marcada.' : 'Presença removida.'
      );
      return response.data;
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  return {
    inscritos,
    isLoading,
    error,
    inscrever,
    desinscrever,
    fetchInscritos,
    confirmarPresencaManual,
  };
}

export default useInscricao;

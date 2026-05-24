import { useState, useCallback } from 'react';
import apiClient from '../lib/api';
import CursoFactory from '../factories/CursoFactory';
import toast from 'react-hot-toast';

/**
 * Custom hook for Curso operations (list, get, create, delete).
 * No `updateCurso` -- backend does not expose PATCH /cursos/{id}.
 */
export function useCurso() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cursos, setCursos] = useState([]);
  const [curso, setCurso] = useState(null);

  const handleError = useCallback((err) => {
    const errorMessage =
      err.response?.data?.detail || err.message || 'Erro ao processar requisicao do curso.';
    setError(errorMessage);
    toast.error(errorMessage);
    throw err;
  }, []);

  /** GET /cursos/ */
  const fetchCursos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.cursos.getAll();
      setCursos(response.data);
      return response.data;
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  /** GET /cursos/{id} */
  const fetchCursoById = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.cursos.getById(id);
      setCurso(response.data);
      return response.data;
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  /** POST /cursos/create */
  const createCurso = useCallback(async (formData) => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = CursoFactory.buildCursoForCreate(formData);
      const response = await apiClient.cursos.create(payload);
      toast.success('Curso criado com sucesso!');
      return response.data;
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  /** DELETE /cursos/{id} */
  const deleteCurso = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.cursos.delete(id);
      toast.success('Curso excluido com sucesso!');
      return response.data;
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  return {
    cursos,
    curso,
    isLoading,
    error,
    fetchCursos,
    fetchCursoById,
    createCurso,
    deleteCurso,
  };
}

export default useCurso;

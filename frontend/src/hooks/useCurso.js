import { useState, useCallback } from 'react';
import apiClient from '../lib/api';
import CursoFactory from '../factories/CursoFactory';
import toast from 'react-hot-toast';

/**
 * Custom hook for Curso CRUD operations.
 * Handles loading states, errors, API requests, and maps data via CursoFactory.
 */
export function useCurso() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cursos, setCursos] = useState([]);
  const [curso, setCurso] = useState(null);

  /**
   * Safe wrapper to handle request errors.
   */
  const handleError = useCallback((err) => {
    const errorMessage = err.response?.data?.detail || err.message || 'Erro ao processar requisição do curso.';
    setError(errorMessage);
    toast.error(errorMessage);
    throw err;
  }, []);

  /**
   * Fetches all courses.
   * 
   * @returns {Promise<import('../factories/CursoFactory').CursoResponse[]>}
   */
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

  /**
   * Fetches a single course by ID.
   * 
   * @param {number} id - Course ID.
   * @returns {Promise<import('../factories/CursoFactory').CursoResponse>}
   */
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

  /**
   * Creates a new course. Maps data with CursoFactory.
   * 
   * @param {Object} formData - Form data from frontend.
   * @returns {Promise<import('../factories/CursoFactory').CursoResponse>}
   */
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

  /**
   * Updates an existing course. Maps data with CursoFactory.
   * 
   * @param {number} id - Course ID to update.
   * @param {Object} formData - Form data to update.
   * @returns {Promise<import('../factories/CursoFactory').CursoResponse>}
   */
  const updateCurso = useCallback(async (id, formData) => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = CursoFactory.buildCursoForUpdate(formData);
      const response = await apiClient.cursos.update(id, payload);
      toast.success('Curso atualizado com sucesso!');
      return response.data;
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  /**
   * Deletes a course.
   * 
   * @param {number} id - Course ID.
   * @returns {Promise<{message: string}>}
   */
  const deleteCurso = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.cursos.delete(id);
      toast.success('Curso excluído com sucesso!');
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
    updateCurso,
    deleteCurso
  };
}

export default useCurso;

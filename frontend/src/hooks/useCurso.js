import { useState, useCallback } from 'react';
import apiClient from '../lib/api';
import CursoFactory from '../factories/CursoFactory';
import toast from 'react-hot-toast';

export function useCurso() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cursos, setCursos] = useState([]);
  const [curso, setCurso] = useState(null);

  const handleError = useCallback((err) => {
    const msg = err.response?.data?.detail || err.message || 'Erro ao processar curso.';
    setError(msg);
    toast.error(msg);
    throw err;
  }, []);

  const fetchCursos = useCallback(async () => {
    setIsLoading(true); setError(null);
    try {
      const response = await apiClient.cursos.getAll();
      setCursos(response.data);
      return response.data;
    } catch (err) { handleError(err); } finally { setIsLoading(false); }
  }, [handleError]);

  const fetchCursoById = useCallback(async (id) => {
    setIsLoading(true); setError(null);
    try {
      const response = await apiClient.cursos.getById(id);
      setCurso(response.data);
      return response.data;
    } catch (err) { handleError(err); } finally { setIsLoading(false); }
  }, [handleError]);

  const createCurso = useCallback(async (formData) => {
    setIsLoading(true); setError(null);
    try {
      const payload = CursoFactory.buildCursoForCreate(formData);
      const response = await apiClient.cursos.create(payload);
      toast.success('Curso criado com sucesso!');
      return response.data;
    } catch (err) { handleError(err); } finally { setIsLoading(false); }
  }, [handleError]);

  const deleteCurso = useCallback(async (id) => {
    setIsLoading(true); setError(null);
    try {
      const response = await apiClient.cursos.delete(id);
      toast.success('Curso excluido com sucesso!');
      return response.data;
    } catch (err) { handleError(err); } finally { setIsLoading(false); }
  }, [handleError]);

  return { cursos, curso, isLoading, error, fetchCursos, fetchCursoById, createCurso, deleteCurso };
}

export default useCurso;

import { useState, useCallback } from 'react';
import apiClient from '../lib/api';
import UserFactory from '../factories/UserFactory';
import toast from 'react-hot-toast';

export function useUser() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);

  const handleError = useCallback((err) => {
    const msg = err.response?.data?.detail || err.message || 'Erro ao processar usuario.';
    setError(msg);
    toast.error(msg);
    throw err;
  }, []);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true); setError(null);
    try {
      const response = await apiClient.users.getAll();
      setUsers(response.data);
      return response.data;
    } catch (err) { handleError(err); } finally { setIsLoading(false); }
  }, [handleError]);

  const fetchUserById = useCallback(async (id) => {
    setIsLoading(true); setError(null);
    try {
      const response = await apiClient.users.getById(id);
      setUser(response.data);
      return response.data;
    } catch (err) { handleError(err); } finally { setIsLoading(false); }
  }, [handleError]);

  const createAluno = useCallback(async (formData) => {
    setIsLoading(true); setError(null);
    try {
      const payload = UserFactory.buildAlunoForCreate(formData);
      const response = await apiClient.users.createAluno(payload);
      toast.success('Aluno cadastrado com sucesso!');
      return response.data;
    } catch (err) { handleError(err); } finally { setIsLoading(false); }
  }, [handleError]);

  const createCredenciado = useCallback(async (formData) => {
    setIsLoading(true); setError(null);
    try {
      const payload = UserFactory.buildCredenciadoForCreate(formData);
      const response = await apiClient.users.createCredenciado(payload);
      toast.success('Credenciado cadastrado com sucesso!');
      return response.data;
    } catch (err) { handleError(err); } finally { setIsLoading(false); }
  }, [handleError]);

  const deleteUser = useCallback(async (id) => {
    setIsLoading(true); setError(null);
    try {
      const response = await apiClient.users.delete(id);
      toast.success('Usuario excluido com sucesso!');
      return response.data;
    } catch (err) { handleError(err); } finally { setIsLoading(false); }
  }, [handleError]);

  return { users, user, isLoading, error, fetchUsers, fetchUserById, createAluno, createCredenciado, deleteUser };
}

export default useUser;

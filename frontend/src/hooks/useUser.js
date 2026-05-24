import { useState, useCallback } from 'react';
import apiClient from '../lib/api';
import UserFactory from '../factories/UserFactory';
import toast from 'react-hot-toast';

/**
 * Custom hook for User operations (create aluno/credenciado, list, get, delete).
 * The backend does NOT expose a generic PATCH /users/{id} update endpoint,
 * so no `updateUser` is provided here.
 */
export function useUser() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);

  const handleError = useCallback((err) => {
    const errorMessage =
      err.response?.data?.detail || err.message || 'Erro ao processar requisicao do usuario.';
    setError(errorMessage);
    toast.error(errorMessage);
    throw err;
  }, []);

  /** GET /users/  (requires JWT) */
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.users.getAll();
      setUsers(response.data);
      return response.data;
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  /** GET /users/{id}  (requires JWT) */
  const fetchUserById = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.users.getById(id);
      setUser(response.data);
      return response.data;
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  /** POST /users/create/aluno  (public) */
  const createAluno = useCallback(async (formData) => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = UserFactory.buildAlunoForCreate(formData);
      const response = await apiClient.users.createAluno(payload);
      toast.success('Aluno cadastrado com sucesso!');
      return response.data;
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  /** POST /users/create/credenciado  (requires credenciado JWT) */
  const createCredenciado = useCallback(async (formData) => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = UserFactory.buildCredenciadoForCreate(formData);
      const response = await apiClient.users.createCredenciado(payload);
      toast.success('Credenciado cadastrado com sucesso!');
      return response.data;
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  /** DELETE /users/{id}  (requires credenciado JWT) */
  const deleteUser = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.users.delete(id);
      toast.success('Usuario excluido com sucesso!');
      return response.data;
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  return {
    users,
    user,
    isLoading,
    error,
    fetchUsers,
    fetchUserById,
    createAluno,
    createCredenciado,
    deleteUser,
  };
}

export default useUser;

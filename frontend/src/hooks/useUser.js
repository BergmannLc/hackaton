import { useState, useCallback } from 'react';
import apiClient from '../lib/api';
import UserFactory from '../factories/UserFactory';
import toast from 'react-hot-toast';

/**
 * Custom hook for User CRUD operations.
 * Handles loading states, errors, API requests, and maps data via UserFactory.
 */
export function useUser() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);

  /**
   * Safe wrapper to handle request errors.
   */
  const handleError = useCallback((err) => {
    const errorMessage = err.response?.data?.detail || err.message || 'Erro ao processar requisição do usuário.';
    setError(errorMessage);
    toast.error(errorMessage);
    throw err;
  }, []);

  /**
   * Fetches all users.
   * 
   * @returns {Promise<import('../factories/UserFactory').UserResponse[]>}
   */
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

  /**
   * Fetches a single user by ID.
   * 
   * @param {number} id - User ID.
   * @returns {Promise<import('../factories/UserFactory').UserResponse>}
   */
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

  /**
   * Creates a new user. Maps data with UserFactory.
   * 
   * @param {import('../factories/UserFactory').UserFormData} formData - Form data from frontend.
   * @returns {Promise<import('../factories/UserFactory').UserResponse>}
   */
  const createUser = useCallback(async (formData) => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = UserFactory.buildUserForCreate(formData);
      const response = await apiClient.users.create(payload);
      toast.success('Usuário criado com sucesso!');
      return response.data;
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  /**
   * Updates an existing user. Maps data with UserFactory.
   * 
   * @param {number} id - User ID to update.
   * @param {import('../factories/UserFactory').UserFormData} formData - Form data to update.
   * @returns {Promise<import('../factories/UserFactory').UserResponse>}
   */
  const updateUser = useCallback(async (id, formData) => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = UserFactory.buildUserForUpdate(formData);
      const response = await apiClient.users.update(id, payload);
      toast.success('Usuário atualizado com sucesso!');
      return response.data;
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  /**
   * Deletes a user.
   * 
   * @param {number} id - User ID.
   * @returns {Promise<{message: string}>}
   */
  const deleteUser = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.users.delete(id);
      toast.success('Usuário excluído com sucesso!');
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
    createUser,
    updateUser,
    deleteUser
  };
}

export default useUser;

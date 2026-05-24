/**
 * JSDoc definitions for Sugestao entity.
 * 
 * @typedef {Object} SugestaoFormData
 * @property {string} title - Title of the suggestion/idea.
 * @property {string} description - Why the idea would be cool/needed.
 * @property {number} [user_id] - ID of the suggesting user.
 * @property {number} [userId] - Alternative property name for user ID.
 * @property {string} [status] - Status of the suggestion (e.g. "pendente", "aprovada").
 * 
 * @typedef {Object} SugestaoRequest
 * @property {string} nome - Title of the suggestion.
 * @property {string} descricao - Detailed description.
 * @property {number} user_id - Author ID.
 * 
 * @typedef {Object} SugestaoResponse
 * @property {number} id - Unique identifier of the suggestion.
 * @property {string} nome - Title of the suggestion.
 * @property {string} descricao - Detailed description.
 * @property {number} user_id - Author ID.
 * @property {string} status - Current status of the suggestion ("pendente" or "aprovada").
 */

export const SugestaoFactory = {
  /**
   * Builds the payload to create a new Sugestao.
   * 
   * @param {SugestaoFormData} formData - The frontend form data.
   * @returns {SugestaoRequest} The exact payload for POST request.
   */
  buildSugestaoForCreate(formData) {
    return {
      nome: formData.title || formData.nome || '',
      descricao: formData.description || formData.descricao || '',
      user_id: parseInt(formData.user_id || formData.userId || 0, 10),
    };
  },

  /**
   * Builds the payload to update an existing Sugestao.
   * 
   * @param {SugestaoFormData} formData - The frontend form data.
   * @returns {SugestaoRequest} The exact payload for PATCH request.
   */
  buildSugestaoForUpdate(formData) {
    return {
      nome: formData.title || formData.nome || '',
      descricao: formData.description || formData.descricao || '',
      user_id: parseInt(formData.user_id || formData.userId || 0, 10),
    };
  }
};

export default SugestaoFactory;

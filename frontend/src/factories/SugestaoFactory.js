/**
 * JSDoc definitions for Sugestao entity.
 *
 * @typedef {Object} SugestaoFormData
 * @property {string}  [title]
 * @property {string}  [nome]
 * @property {string}  [description]
 * @property {string}  [descricao]
 * @property {number}  [user_id]
 * @property {number}  [userId]
 *
 * @typedef {Object} SugestaoRequest
 * @property {string} nome
 * @property {string} descricao
 * @property {number} user_id
 *
 * @typedef {Object} SugestaoResponse
 * @property {number} id
 * @property {string} nome
 * @property {string} descricao
 * @property {number} user_id
 * @property {"pendente" | "aprovada"} status
 */

export const SugestaoFactory = {
  /**
   * Builds the payload to create a new Sugestao.
   * Endpoint: POST /sugestoes/create
   *
   * @param {SugestaoFormData} formData
   * @returns {SugestaoRequest}
   */
  buildSugestaoForCreate(formData) {
    return {
      nome: formData.title || formData.nome || '',
      descricao: formData.description || formData.descricao || '',
      user_id: parseInt(formData.user_id || formData.userId || 0, 10),
    };
  },
};

export default SugestaoFactory;

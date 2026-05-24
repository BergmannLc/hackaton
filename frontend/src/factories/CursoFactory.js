/**
 * JSDoc definitions for Curso entity.
 *
 * @typedef {Object} CursoRequest
 * @property {string} nome
 *
 * @typedef {Object} CursoResponse
 * @property {number} id
 * @property {string} nome
 */

export const CursoFactory = {
  /**
   * Builds the payload to create a new Curso.
   * Endpoint: POST /cursos/create
   *
   * @param {Object} formData
   * @param {string} [formData.nome]
   * @param {string} [formData.name]
   * @returns {CursoRequest}
   */
  buildCursoForCreate(formData) {
    return {
      nome: formData.nome || formData.name || '',
    };
  },
};

export default CursoFactory;

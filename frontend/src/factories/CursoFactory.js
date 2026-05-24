/**
 * JSDoc definitions for Curso entity.
 * 
 * @typedef {Object} CursoRequest
 * @property {string} nome - Name of the course.
 * 
 * @typedef {Object} CursoResponse
 * @property {number} id - Unique identifier of the course.
 * @property {string} nome - Name of the course.
 */

export const CursoFactory = {
  /**
   * Builds the payload to create a new Curso.
   * 
   * @param {Object} formData - The source form data.
   * @param {string} [formData.nome] - The course name.
   * @param {string} [formData.name] - Alternative property for name.
   * @returns {CursoRequest} The exact payload for POST request.
   */
  buildCursoForCreate(formData) {
    return {
      nome: formData.nome || formData.name || '',
    };
  },

  /**
   * Builds the payload to update an existing Curso.
   * 
   * @param {Object} formData - The source form data.
   * @param {string} [formData.nome] - The course name.
   * @param {string} [formData.name] - Alternative property for name.
   * @returns {CursoRequest} The exact payload for PATCH request.
   */
  buildCursoForUpdate(formData) {
    return {
      nome: formData.nome || formData.name || '',
    };
  }
};

export default CursoFactory;

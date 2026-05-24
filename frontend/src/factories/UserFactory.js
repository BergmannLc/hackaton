/**
 * JSDoc definitions for User entity.
 *
 * @typedef {"aluno" | "credenciado"} RoleEnum
 *
 * @typedef {Object} UserFormData
 * @property {string} [name]
 * @property {string} [nome]
 * @property {string} [matricula]
 * @property {string} [siape]
 * @property {string} [password]
 * @property {string} [senha]
 * @property {number} [curso_id]
 * @property {number} [cursoId]
 *
 * @typedef {Object} AlunoRequest
 * @property {string} nome
 * @property {string} matricula
 * @property {string} senha
 * @property {number} curso_id
 *
 * @typedef {Object} CredenciadoRequest
 * @property {string} nome
 * @property {string} matricula
 * @property {string} senha
 *
 * @typedef {Object} UserResponse
 * @property {number} id
 * @property {string} nome
 * @property {string} matricula
 * @property {RoleEnum} roles
 */

export const UserFactory = {
  /**
   * Builds the payload to create a new Aluno.
   * Endpoint: POST /users/create/aluno
   *
   * @param {UserFormData} formData
   * @returns {AlunoRequest}
   */
  buildAlunoForCreate(formData) {
    return {
      nome: formData.name || formData.nome || '',
      matricula: formData.matricula || '',
      senha: formData.password || formData.senha || '',
      curso_id: parseInt(formData.curso_id || formData.cursoId || 0, 10),
    };
  },

  /**
   * Builds the payload to create a new Credenciado (professor/admin).
   * Endpoint: POST /users/create/credenciado (requires credenciado JWT)
   *
   * @param {UserFormData} formData
   * @returns {CredenciadoRequest}
   */
  buildCredenciadoForCreate(formData) {
    return {
      nome: formData.name || formData.nome || '',
      matricula: formData.matricula || formData.siape || '',
      senha: formData.password || formData.senha || '',
    };
  },
};

export default UserFactory;

/**
 * JSDoc definitions for User entity.
 * 
 * @typedef {"aluno" | "credenciado"} RoleEnum
 * 
 * @typedef {Object} UserFormData
 * @property {string} [name] - Full name of the user.
 * @property {string} [nome] - Full name of the user (alternative).
 * @property {string} [matricula] - Enrollment id/registration number.
 * @property {string} [siape] - Professor ID/SIAPE.
 * @property {string} [password] - User password.
 * @property {string} [senha] - User password (alternative).
 * @property {RoleEnum | "professor"} [role] - User role from frontend.
 * @property {RoleEnum | "professor"} [roles] - User role from frontend (alternative).
 * 
 * @typedef {Object} UserRequest
 * @property {string} nome - Name of the user.
 * @property {string} matricula - Unique identification number.
 * @property {string} senha - Password credentials.
 * @property {RoleEnum} roles - User access level role.
 * 
 * @typedef {Object} UserResponse
 * @property {number} id - Unique identifier of the user.
 * @property {string} nome - Name of the user.
 * @property {string} matricula - Unique identification number.
 * @property {RoleEnum} roles - User access level role.
 */

/**
 * Maps the frontend role value to the strict backend RoleEnum.
 * 
 * @param {string} roleValue 
 * @returns {RoleEnum}
 */
function mapRole(roleValue) {
  if (roleValue === 'professor' || roleValue === 'credenciado') {
    return 'credenciado';
  }
  return 'aluno';
}

export const UserFactory = {
  /**
   * Builds the payload to create a new User.
   * 
   * @param {UserFormData} formData - The frontend form data.
   * @returns {UserRequest} The exact payload for POST request.
   */
  buildUserForCreate(formData) {
    const rawRole = formData.roles || formData.role || 'aluno';
    return {
      nome: formData.name || formData.nome || '',
      matricula: formData.matricula || formData.siape || '',
      senha: formData.password || formData.senha || '',
      roles: mapRole(rawRole),
    };
  },

  /**
   * Builds the payload to update an existing User.
   * 
   * @param {UserFormData} formData - The frontend form data.
   * @returns {UserRequest} The exact payload for PATCH request.
   */
  buildUserForUpdate(formData) {
    const rawRole = formData.roles || formData.role || 'aluno';
    return {
      nome: formData.name || formData.nome || '',
      matricula: formData.matricula || formData.siape || '',
      senha: formData.password || formData.senha || '',
      roles: mapRole(rawRole),
    };
  }
};

export default UserFactory;

function mapearRole(role) {
  if (role === 'professor' || role === 'credenciado') return 'credenciado';
  return 'aluno';
}

export const UserFactory = {
  buildAlunoForCreate(formData) {
    return {
      nome: formData.name || formData.nome || '',
      matricula: formData.matricula || '',
      senha: formData.password || formData.senha || '',
      curso_id: parseInt(formData.curso_id || formData.cursoId || 0, 10),
    };
  },

  buildCredenciadoForCreate(formData) {
    return {
      nome: formData.name || formData.nome || '',
      matricula: formData.matricula || formData.siape || '',
      senha: formData.password || formData.senha || '',
    };
  },
};

export default UserFactory;

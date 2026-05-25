export const SugestaoFactory = {
  buildSugestaoForCreate(formData) {
    return {
      nome: formData.title || formData.nome || '',
      descricao: formData.description || formData.descricao || '',
      user_id: parseInt(formData.user_id || formData.userId || 0, 10),
    };
  },
};

export default SugestaoFactory;

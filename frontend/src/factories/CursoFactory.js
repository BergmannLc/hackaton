export const CursoFactory = {
  buildCursoForCreate(formData) {
    return {
      nome: formData.nome || formData.name || '',
    };
  },
};

export default CursoFactory;

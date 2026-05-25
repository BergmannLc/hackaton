function dividirHorario(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return [null, null];
  const partes = timeStr.split('-').map((p) => p.trim());
  const valido = (t) => /^\d{1,2}:\d{2}$/.test(t);
  const inicio = valido(partes[0]) ? partes[0].padStart(5, '0') : null;
  const fim = partes[1] && valido(partes[1]) ? partes[1].padStart(5, '0') : null;
  return [inicio, fim];
}

function paraIso(dataStr, timeStr) {
  try {
    if (!dataStr) return new Date().toISOString();
    const [inicio] = dividirHorario(timeStr);
    const hhmm = inicio || '12:00';
    const dataObj = new Date(`${dataStr}T${hhmm}:00`);
    return isNaN(dataObj.getTime()) ? new Date().toISOString() : dataObj.toISOString();
  } catch {
    return new Date().toISOString();
  }
}

export const EventoFactory = {
  buildEventoForCreate(formData) {
    const [horaInicio, horaFim] = dividirHorario(formData.time);
    return {
      nome: formData.title || formData.nome || '',
      descricao: formData.description || formData.descricao || undefined,
      local: formData.location || formData.local || undefined,
      palestrante: formData.speaker || formData.palestrante || undefined,
      tipo: formData.category || formData.tipo || undefined,
      data: formData.data || paraIso(formData.date, formData.time),
      hora_inicio: formData.hora_inicio || horaInicio || undefined,
      hora_fim: formData.hora_fim || horaFim || undefined,
      horas:
        formData.hours != null
          ? parseInt(formData.hours, 10)
          : formData.horas != null
            ? parseInt(formData.horas, 10)
            : undefined,
      imagem: formData.image || formData.imagem || undefined,
      max_user: parseInt(formData.spots || formData.max_user || 0, 10),
      curso_ids: Array.isArray(formData.curso_ids) ? formData.curso_ids : [],
    };
  },
};

export default EventoFactory;

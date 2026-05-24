/**
 * JSDoc definitions for Evento entity.
 *
 * Matches backend/app/dtos/EventoDto.py.
 *
 * @typedef {Object} EventoFormData
 * @property {number}   [id]
 * @property {string}   [title]
 * @property {string}   [nome]
 * @property {string}   [category]
 * @property {string}   [tipo]
 * @property {string}   [date]
 * @property {string}   [data]
 * @property {string}   [time]
 * @property {string}   [hora_inicio]
 * @property {string}   [hora_fim]
 * @property {string}   [location]
 * @property {string}   [local]
 * @property {string}   [speaker]
 * @property {string}   [palestrante]
 * @property {string}   [description]
 * @property {string}   [descricao]
 * @property {string}   [image]
 * @property {string}   [imagem]
 * @property {number}   [hours]
 * @property {number}   [horas]
 * @property {number}   [spots]
 * @property {number}   [max_user]
 * @property {number[]} [curso_ids]
 *
 * @typedef {Object} EventoRequest
 * @property {string}   nome
 * @property {string}   [descricao]
 * @property {string}   [local]
 * @property {string}   [palestrante]
 * @property {string}   [tipo]
 * @property {string}   data
 * @property {string}   [hora_inicio]
 * @property {string}   [hora_fim]
 * @property {number}   [horas]
 * @property {string}   [imagem]
 * @property {number}   max_user
 * @property {number[]} curso_ids
 *
 * @typedef {Object} EventoResponse
 * @property {number}   id
 * @property {string}   nome
 * @property {string}   [descricao]
 * @property {string}   [local]
 * @property {string}   [palestrante]
 * @property {string}   [tipo]
 * @property {string}   data
 * @property {string}   [hora_inicio]
 * @property {string}   [hora_fim]
 * @property {number}   [horas]
 * @property {string}   [imagem]
 * @property {number}   max_user
 */

function splitTime(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return [null, null];
  const parts = timeStr.split('-').map((p) => p.trim());
  const isValid = (t) => /^\d{1,2}:\d{2}$/.test(t);
  const start = isValid(parts[0]) ? parts[0].padStart(5, '0') : null;
  const end = parts[1] && isValid(parts[1]) ? parts[1].padStart(5, '0') : null;
  return [start, end];
}

function toIsoDate(dateStr, timeStr) {
  try {
    if (!dateStr) return new Date().toISOString();
    const [start] = splitTime(timeStr);
    const hhmm = start || '12:00';
    const dateObj = new Date(`${dateStr}T${hhmm}:00`);
    return isNaN(dateObj.getTime()) ? new Date().toISOString() : dateObj.toISOString();
  } catch {
    return new Date().toISOString();
  }
}

export const EventoFactory = {
  /**
   * Builds the payload to create a new Evento.
   * Endpoint: POST /eventos/create
   *
   * @param {EventoFormData} formData
   * @returns {EventoRequest}
   */
  buildEventoForCreate(formData) {
    const [horaInicio, horaFim] = splitTime(formData.time);
    return {
      nome: formData.title || formData.nome || '',
      descricao: formData.description || formData.descricao || undefined,
      local: formData.location || formData.local || undefined,
      palestrante: formData.speaker || formData.palestrante || undefined,
      tipo: formData.category || formData.tipo || undefined,
      data: formData.data || toIsoDate(formData.date, formData.time),
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

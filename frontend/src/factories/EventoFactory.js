/**
 * JSDoc definitions for Evento entity.
 * 
 * @typedef {Object} EventoFormData
 * @property {number} [id] - Optional ID (if editing).
 * @property {string} title - Title of the event.
 * @property {string} category - Category (e.g. Palestras, Workshops).
 * @property {string} date - Date in YYYY-MM-DD format.
 * @property {string} time - Time string (e.g. "14:00 - 16:00").
 * @property {string} location - Location description.
 * @property {number} hours - Number of certified hours.
 * @property {number} spots - Maximum number of spots.
 * @property {string} speaker - Name of the speaker.
 * @property {string} description - Detailed description.
 * @property {string} image - Cover image URL.
 * @property {string[]} courses - List of recommended courses.
 * @property {number} [enrolled] - Count of enrolled users.
 * @property {boolean} [isEnrolled] - Whether current user is enrolled.
 * 
 * @typedef {Object} EventoRequest
 * @property {string} nome - Backend field mapping to title/nome.
 * @property {string} data - ISO 8601 formatted datetime string.
 * @property {number} max_user - Backend field mapping to spots/max_user.
 * 
 * @typedef {Object} EventoResponse
 * @property {number} id - Unique identifier of the event.
 * @property {string} nome - Name of the event.
 * @property {string} data - ISO 8601 formatted datetime string.
 * @property {number} max_user - Maximum number of participants.
 */

/**
 * Helper to safely combine date and start time into an ISO 8601 datetime string.
 * 
 * @param {string} dateStr - Date string (YYYY-MM-DD)
 * @param {string} timeStr - Time string (e.g. "14:00 - 16:00")
 * @returns {string} ISO datetime string.
 */
function convertToISODate(dateStr, timeStr) {
  try {
    if (!dateStr) return new Date().toISOString();
    
    // Extract the start time from something like "14:00 - 16:00"
    const startTime = timeStr ? timeStr.split('-')[0].trim() : '12:00';
    
    // Validate HH:MM format
    const timeMatch = startTime.match(/^(\d{1,2}):(\d{2})$/);
    let hh = '12';
    let mm = '00';
    if (timeMatch) {
      hh = timeMatch[1].padStart(2, '0');
      mm = timeMatch[2];
    }
    
    const dateObj = new Date(`${dateStr}T${hh}:${mm}:00`);
    return isNaN(dateObj.getTime()) ? new Date().toISOString() : dateObj.toISOString();
  } catch {
    return new Date().toISOString();
  }
}

export const EventoFactory = {
  /**
   * Builds the payload to create a new Evento.
   * 
   * @param {EventoFormData} formData - The frontend form data.
   * @returns {EventoRequest} The exact payload for POST request.
   */
  buildEventoForCreate(formData) {
    return {
      nome: formData.title || formData.nome || '',
      data: convertToISODate(formData.date, formData.time),
      max_user: parseInt(formData.spots || formData.max_user || 0, 10),
    };
  },

  /**
   * Builds the payload to update an existing Evento.
   * 
   * @param {EventoFormData} formData - The frontend form data.
   * @returns {EventoRequest} The exact payload for PATCH request.
   */
  buildEventoForUpdate(formData) {
    return {
      nome: formData.title || formData.nome || '',
      data: convertToISODate(formData.date, formData.time),
      max_user: parseInt(formData.spots || formData.max_user || 0, 10),
    };
  }
};

export default EventoFactory;

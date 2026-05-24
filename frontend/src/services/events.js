import { INITIAL_EVENTS } from './mocks';

// Estado em memória para manter alterações no frontend mockado
let eventsState = [...INITIAL_EVENTS];

// Quando o backend estiver pronto, troque para:
// import api from './api';
// export const getEvents = async () => await api.get('/events');

export const getEvents = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ data: eventsState }), 500);
  });
};

export const enrollInEvent = async (eventId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      eventsState = eventsState.map(e => 
        e.id === eventId ? { ...e, isEnrolled: true, enrolled: e.enrolled + 1 } : e
      );
      resolve({ data: { success: true } });
    }, 500);
  });
};

export const cancelEnrollment = async (eventId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      eventsState = eventsState.map(e => 
        e.id === eventId ? { ...e, isEnrolled: false, enrolled: e.enrolled - 1 } : e
      );
      resolve({ data: { success: true } });
    }, 500);
  });
};

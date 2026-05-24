import { INITIAL_SUGGESTIONS, INITIAL_CERTS, MOCK_USER } from './mocks';

let suggestionsState = [...INITIAL_SUGGESTIONS];
let certsState = [...INITIAL_CERTS];

export const getSuggestions = async () => {
  return new Promise((resolve) => setTimeout(() => resolve({ data: suggestionsState }), 500));
};

export const addSuggestion = async (suggestion) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newSug = { ...suggestion, id: Date.now(), student: MOCK_USER.name, date: new Date().toISOString().split('T')[0], status: 'pendente' };
      suggestionsState.push(newSug);
      resolve({ data: newSug });
    }, 500);
  });
};

export const submitCertificate = async (certData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      certsState.push({ id: Date.now(), ...certData, status: 'pendente' });
      resolve({ data: { success: true } });
    }, 1500);
  });
};

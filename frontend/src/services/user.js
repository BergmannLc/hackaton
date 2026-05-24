import { INITIAL_SUGGESTIONS, MOCK_USER } from './mocks';

let suggestionsState = [...INITIAL_SUGGESTIONS];

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


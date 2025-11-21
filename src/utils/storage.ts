import type { SavedFact } from '../types';

export const loadFacts = (): SavedFact[] => {
  try {
    const storedFacts = localStorage.getItem('catFacts');
    return storedFacts ? JSON.parse(storedFacts) : [];
  } catch (e) {
    console.error('Error loading from localStorage:', e);
    return [];
  }
};

export const saveFacts = (facts: SavedFact[]): void => {
  try {
    localStorage.setItem('catFacts', JSON.stringify(facts));
  } catch (e) {
    console.error('Error saving facts to localStorage:', e);
  }
};

export const loadTheme = (): boolean => {
  try {
    const storedTheme = localStorage.getItem('catFactsTheme');
    return storedTheme === 'dark';
  } catch (e) {
    console.error('Error loading theme from localStorage:', e);
    return false;
  }
};

export const saveTheme = (isDark: boolean): void => {
  try {
    localStorage.setItem('catFactsTheme', isDark ? 'dark' : 'light');
  } catch (e) {
    console.error('Error saving theme to localStorage:', e);
  }
};
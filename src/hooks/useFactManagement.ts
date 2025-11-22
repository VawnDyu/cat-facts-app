import { useState, useEffect, useRef } from 'react';
import { loadFacts, saveFacts } from '../utils/storage';
import type { SavedFact } from '../types';

export const useFactManagement = () => {
  const [savedFactsList, setSavedFactsList] = useState<SavedFact[]>(() => loadFacts());
  const [filterRating, setFilterRating] = useState<number>(0);
  const isInitialMount = useRef(true);

  // Only save when data changes AFTER initial mount
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    saveFacts(savedFactsList);
  }, [savedFactsList]);

  const filteredFacts = filterRating === 0
    ? savedFactsList
    : savedFactsList.filter(fact => fact.rating === filterRating);

  const deleteFact = (id: string) => {
    setSavedFactsList(savedFactsList.filter(f => f.id !== id));
  };

  const addFact = (fact: SavedFact) => {
    setSavedFactsList([fact, ...savedFactsList]);
  };

  return {
    savedFactsList,
    filteredFacts,
    filterRating,
    setFilterRating,
    deleteFact,
    addFact,
  };
};
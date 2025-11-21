import type { SavedFact } from '../types';

export const exportToText = (savedFacts: SavedFact[]): void => {
  if (savedFacts.length === 0) return;

  let textContent = '🐱 My Saved Cat Facts 🐱\n';
  textContent += '='.repeat(50) + '\n\n';

  savedFacts.forEach((fact, index) => {
    textContent += `${index + 1}. ${fact.fact}\n`;
    textContent += `   Rating: ${'⭐'.repeat(fact.rating)}\n`;
    textContent += `   Saved on: ${new Date(fact.savedAt).toLocaleDateString()}\n\n`;
  });

  textContent += '\n' + '='.repeat(50) + '\n';
  textContent += `Total facts saved: ${savedFacts.length}\n`;
  textContent += `Exported on: ${new Date().toLocaleString()}\n`;

  const blob = new Blob([textContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `cat-facts-${Date.now()}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
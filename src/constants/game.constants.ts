export const GAME_CONFIG = {
  Mega: {
    type: 'Mega' as const,
    totalNumbers: 60,
    maxSelections: 10,
    selectedColor: '#2e7d32',
  },
  Quina: {
    type: 'Quina' as const,
    totalNumbers: 80,
    maxSelections: 10,
    selectedColor: '#1565c0',
  },
} as const;


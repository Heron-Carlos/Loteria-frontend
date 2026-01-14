export type BetValidationResult = {
  isValid: boolean;
  error: string | null;
};

type ValidateBetFormParams = {
  playerName: string;
  selectedPartnerId: string;
  selectedNumbers: number[];
  maxSelections: number;
  gameType: string;
};

export const validateBetForm = ({
  playerName,
  selectedPartnerId,
  selectedNumbers,
  maxSelections,
  gameType,
}: ValidateBetFormParams): BetValidationResult => {
  const trimmedName = playerName.trim();

  if (!trimmedName) {
    return {
      isValid: false,
      error: 'Preencha o nome do jogador.',
    };
  }

  if (!selectedPartnerId) {
    return {
      isValid: false,
      error: 'Selecione um sócio responsável pela aposta.',
    };
  }

  if (selectedNumbers.length < maxSelections) {
    return {
      isValid: false,
      error: `Selecione ${maxSelections} números para a ${gameType}. Você selecionou ${selectedNumbers.length}.`,
    };
  }

  return {
    isValid: true,
    error: null,
  };
};


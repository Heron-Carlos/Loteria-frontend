import { Bet } from '../types/bet.types';

export const sortNumbers = (numbers: number[]): number[] => {
  return [...numbers].sort((a, b) => a - b);
};

export const formatPlayerNameForDisplay = (playerName: string): string => {
  const trimmed = playerName.trim();
  const match = trimmed.match(/^(.+?)\s+(\d+)$/);
  
  if (match) {
    const baseName = match[1].trim();
    const number = parseInt(match[2], 10);
    return `${baseName} ${formatSequentialNumber(number)}`;
  }
  
  return trimmed;
};

export const formatSequentialNumber = (num: number): string => {
  return num < 10 ? `0${num}` : `${num}`;
};

const extractBaseNameAndNumber = (playerName: string): { baseName: string; number: number | null } => {
  const trimmed = playerName.trim();
  const match = trimmed.match(/^(.+?)\s+(\d+)$/);
  
  return match
    ? { baseName: match[1].trim(), number: parseInt(match[2], 10) }
    : { baseName: trimmed, number: null };
};

const countExistingBetsByBaseName = (existingBets: Bet[]): Map<string, number> => {
  const counts = new Map<string, number>();
  
  existingBets.forEach((bet) => {
    const { baseName } = extractBaseNameAndNumber(bet.playerName);
    const currentCount = counts.get(baseName) ?? 0;
    counts.set(baseName, currentCount + 1);
  });
  
  return counts;
};

const getMaxNumberForBaseNames = (existingBets: Bet[]): Map<string, number> => {
  const maxNumbers = new Map<string, number>();
  
  existingBets.forEach((bet) => {
    const { baseName, number } = extractBaseNameAndNumber(bet.playerName);
    const currentMax = maxNumbers.get(baseName) ?? 0;
    const numberToCompare = number ?? 0;
    maxNumbers.set(baseName, Math.max(currentMax, numberToCompare));
  });
  
  return maxNumbers;
};

const countBetsByBaseName = (bets: Bet[]): Map<string, number> => {
  const counts = new Map<string, number>();
  
  bets.forEach((bet) => {
    const { baseName } = extractBaseNameAndNumber(bet.playerName.trim());
    const currentCount = counts.get(baseName) ?? 0;
    counts.set(baseName, currentCount + 1);
  });
  
  return counts;
};

export const addSequentialNumbersToDuplicateNames = (
  bets: Bet[],
  existingBets: Bet[] = []
): Bet[] => {
  const existingCountsByBaseName = countExistingBetsByBaseName(existingBets);
  const maxNumbersFromExisting = getMaxNumberForBaseNames(existingBets);
  const countsByBaseName = countBetsByBaseName(bets);
  const currentCounters = new Map<string, number>();
  
  return bets.map((bet) => {
    const { baseName } = extractBaseNameAndNumber(bet.playerName.trim());
    const existingCount = existingCountsByBaseName.get(baseName) ?? 0;
    const newCount = countsByBaseName.get(baseName) ?? 0;
    const totalCount = existingCount + newCount;
    const shouldAddNumber = totalCount > 1;
    
    const maxNumberFromExisting = maxNumbersFromExisting.get(baseName) ?? 0;
    const hasExistingBetsWithoutNumbers = existingCount > 0 && maxNumberFromExisting === 0;
    const startNumber = hasExistingBetsWithoutNumbers ? existingCount : maxNumberFromExisting;
    
    const currentCount = (currentCounters.get(baseName) ?? startNumber) + 1;
    currentCounters.set(baseName, currentCount);
    
    const playerName = shouldAddNumber
      ? `${baseName} ${formatSequentialNumber(currentCount)}`
      : baseName;
    
    return { ...bet, playerName };
  });
};


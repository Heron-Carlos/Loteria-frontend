import { Bet } from '../types/bet.types';
import { generateUUID } from './uuid';

type CreateBetParams = {
  playerName: string;
  gameType: 'Mega' | 'Quina';
  selectedNumbers: number[];
  partnerId: string;
};

export const createBet = ({ playerName, gameType, selectedNumbers, partnerId }: CreateBetParams): Bet => {
  return {
    id: generateUUID(),
    playerName: playerName.trim(),
    gameType,
    selectedNumbers: [...selectedNumbers].sort((a, b) => a - b),
    isPaid: false,
    partnerId,
  };
};

type PrepareBetsForSendingParams = {
  bets: Bet[];
  defaultPartnerId: string;
};

export const prepareBetsForSending = ({ bets, defaultPartnerId }: PrepareBetsForSendingParams): Bet[] => {
  return bets.map((bet) => ({
    ...bet,
    id: bet.id || generateUUID(),
    partnerId: bet.partnerId || defaultPartnerId,
  }));
};


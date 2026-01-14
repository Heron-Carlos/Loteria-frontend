import { Bet } from '@/types/bet.types';

type Stats = {
  total: number;
  paid: number;
  pending: number;
  mega: number;
  quina: number;
};

export const calculateStats = (bets: Bet[]): Stats => {
  const total = bets.length;
  const paid = bets.filter((bet: Bet) => bet.isPaid).length;
  const pending = total - paid;
  const mega = bets.filter((bet: Bet) => bet.gameType === 'Mega').length;
  const quina = bets.filter((bet: Bet) => bet.gameType === 'Quina').length;

  return { total, paid, pending, mega, quina };
};

export const filterBetsByGameType = (
  bets: Bet[],
  gameType: string | null
): Bet[] => {
  if (!gameType) {
    return bets;
  }
  return bets.filter((bet: Bet) => bet.gameType === gameType);
};


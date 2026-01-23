export type Bet = {
  id: string;
  playerName: string;
  gameType: 'Mega' | 'Quina';
  selectedNumbers: number[];
  isPaid: boolean;
  partnerId: string;
};

export type CreateBetRequest = {
  playerName: string;
  gameType: 'Mega' | 'Quina';
  selectedNumbers: number[];
  partnerId: string;
};

export type PaginatedBetsResponse = {
  bets: Bet[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type BetStats = {
  total: number;
  paid: number;
  pending: number;
  mega: number;
  quina: number;
};
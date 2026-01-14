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


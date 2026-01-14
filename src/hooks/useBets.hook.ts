import { useState, useEffect, useCallback } from 'react';
import { Bet } from '../types/bet.types';
import { IBetService } from '../interfaces/services.interface';

export const useBets = (betService: IBetService, gameType?: 'Mega' | 'Quina') => {
  const [bets, setBets] = useState<Bet[]>([]);

  const loadBets = useCallback(() => {
    const localBets = betService.getLocalBets();
    const filteredBets = gameType
      ? localBets.filter((bet) => bet.gameType === gameType)
      : localBets;
    setBets(filteredBets);
  }, [betService, gameType]);

  useEffect(() => {
    loadBets();
  }, [loadBets]);

  const addBet = useCallback(
    (bet: Bet) => {
      betService.addLocalBet(bet);
      loadBets();
    },
    [betService, loadBets]
  );

  const removeBet = useCallback(
    (bet: Bet) => {
      betService.removeLocalBet(bet);
      loadBets();
    },
    [betService, loadBets]
  );

  const clearBets = useCallback(() => {
    if (gameType) {
      betService.clearFilteredLocalBets(gameType);
    } else {
      betService.clearLocalBets();
    }
    loadBets();
  }, [betService, gameType, loadBets]);

  return {
    bets,
    addBet,
    removeBet,
    clearBets,
    reload: loadBets,
  };
};


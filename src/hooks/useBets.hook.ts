import { useState, useEffect, useCallback, useRef } from 'react';
import { Bet } from '../types/bet.types';
import { IBetService } from '../interfaces/services.interface';

export const useBets = (betService: IBetService, gameType?: 'Mega' | 'Quina') => {
  const [bets, setBets] = useState<Bet[]>([]);
  const gameTypeRef = useRef(gameType);

  const loadBets = useCallback(() => {
    const localBets = betService.getLocalBets();
    
    const filteredBets = gameTypeRef.current
      ? localBets.filter((bet) => bet.gameType === gameTypeRef.current)
      : localBets;
    
    setBets(filteredBets);
  }, [betService]);

  useEffect(() => {
    gameTypeRef.current = gameType;
  }, [gameType]);

  useEffect(() => {
    loadBets();
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'bets') {
        loadBets();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
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
    const currentGameType = gameTypeRef.current;
    
    if (currentGameType) {
      betService.clearFilteredLocalBets(currentGameType);
    }
    
    if (!currentGameType) {
      betService.clearLocalBets();
    }
    
    loadBets();
  }, [betService, loadBets]);

  return {
    bets,
    addBet,
    removeBet,
    clearBets,
    reload: loadBets,
  };
};

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { BetStats } from '../types/bet.types';
import { UsePartnerStatsParams } from '../types/hooks.types';

export const usePartnerStats = ({
  betService,
  authService,
  user,
}: UsePartnerStatsParams) => {
  const [stats, setStats] = useState<BetStats>({
    total: 0,
    paid: 0,
    pending: 0,
    mega: 0,
    quina: 0,
  });
  const [loading, setLoading] = useState(false);

  const loadStats = useCallback(async (): Promise<void> => {
    const isLoggedIn = authService.isLoggedIn();
    
    if (!user && !isLoggedIn) {
      return;
    }

    if (!user && isLoggedIn) {
      return;
    }

    setLoading(true);
    try {
      const statsData = await betService.getPartnerStats(user!.userId);
      setStats(statsData);
    } catch (error) {
      toast.error('Erro ao carregar estatísticas.');
    } finally {
      setLoading(false);
    }
  }, [user, betService, authService]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return {
    stats,
    loading,
    reloadStats: loadStats,
  };
};


import { useState, useEffect, useCallback, useRef } from 'react';
import { IBetService, IAuthService } from '../interfaces/services.interface';
import { Bet } from '../types/bet.types';
import { LoginResponse } from '../types/auth.types';
import toast from 'react-hot-toast';

type UsePartnerBetsParams = {
  betService: IBetService;
  authService: IAuthService;
  user: LoginResponse | null;
  filteredGameType: string | null;
  searchTerm?: string;
  isPaidFilter?: boolean | null;
};

export const usePartnerBets = ({
  betService,
  authService,
  user,
  filteredGameType,
  searchTerm,
  isPaidFilter,
}: UsePartnerBetsParams) => {
  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(false);
  const hasShownUnauthorizedToast = useRef(false);
  const initialLoadRef = useRef(true);

  const loadPartnerBets = useCallback(async (): Promise<void> => {
    // Se o serviço de autenticação diz que está logado, mas o user ainda não foi carregado,
    // aguarda um pouco (pode ser carregamento inicial ou após login)
    const isLoggedIn = authService.isLoggedIn();
    
    if (!user && !isLoggedIn) {
      // Realmente não está autenticado
      if (!initialLoadRef.current && !hasShownUnauthorizedToast.current) {
        hasShownUnauthorizedToast.current = true;
        toast.error('Usuário não autenticado. Faça login novamente.');
      }
      return;
    }

    // Se o serviço diz que está logado mas o user ainda não foi carregado,
    // não faz nada e aguarda o próximo render (quando o user será carregado)
    if (!user && isLoggedIn) {
      // Está logado mas o user ainda não foi carregado no estado do hook
      // Aguarda um ciclo de render para o user ser carregado
      return;
    }

    // Reset dos flags quando o usuário está autenticado e carregado
    if (user) {
      hasShownUnauthorizedToast.current = false;
      initialLoadRef.current = false;
    }

    setLoading(true);
    try {
      const partnerBets = await betService.getPartnerBets(
        user!.userId,
        filteredGameType || undefined,
        searchTerm,
        isPaidFilter !== null && isPaidFilter !== undefined ? isPaidFilter : undefined
      );
      setBets(partnerBets);
    } catch (error) {
      toast.error('Erro ao carregar apostas.');
    } finally {
      setLoading(false);
    }
  }, [user, filteredGameType, searchTerm, isPaidFilter, betService, authService]);

  useEffect(() => {
    // Marca que a carga inicial passou após o primeiro render
    const timer = setTimeout(() => {
      initialLoadRef.current = false;
    }, 100);

    loadPartnerBets();

    return () => {
      clearTimeout(timer);
    };
  }, [loadPartnerBets]);

  return {
    bets,
    loading,
    reloadBets: loadPartnerBets,
  };
};


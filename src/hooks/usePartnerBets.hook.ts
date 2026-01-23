import { useState, useEffect, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import { Bet } from '../types/bet.types';
import { UsePartnerBetsParams } from '../types/hooks.types';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const hasShownUnauthorizedToast = useRef(false);
  const initialLoadRef = useRef(true);

  const loadPartnerBets = useCallback(async (page: number = currentPage): Promise<void> => {
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
      const response = await betService.getPartnerBets(
        user!.userId,
        filteredGameType || undefined,
        searchTerm,
        isPaidFilter !== null && isPaidFilter !== undefined ? isPaidFilter : undefined,
        page,
        itemsPerPage
      );
      setBets(response.bets);
      setTotal(response.total);
      setTotalPages(response.totalPages);
      setCurrentPage(page);
    } catch (error) {
      toast.error('Erro ao carregar apostas.');
    } finally {
      setLoading(false);
    }
  }, [user, filteredGameType, searchTerm, isPaidFilter, betService, authService, currentPage, itemsPerPage]);

  useEffect(() => {
    // Marca que a carga inicial passou após o primeiro render
    const timer = setTimeout(() => {
      initialLoadRef.current = false;
    }, 100);

    // Só carrega se o user estiver disponível
    if (user) {
      // Reseta para página 1 quando filtros mudam
      setCurrentPage(1);
      loadPartnerBets(1);
    }

    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, filteredGameType, searchTerm, isPaidFilter, itemsPerPage]);

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      loadPartnerBets(page);
    }
  }, [totalPages, loadPartnerBets]);

  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  }, [currentPage, totalPages, goToPage]);

  const previousPage = useCallback(() => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  }, [currentPage, goToPage]);

  const changeItemsPerPage = useCallback((newLimit: number) => {
    setItemsPerPage(newLimit);
    setCurrentPage(1);
  }, []);

  return {
    bets,
    loading,
    currentPage,
    totalPages,
    total,
    itemsPerPage,
    reloadBets: () => loadPartnerBets(currentPage),
    goToPage,
    nextPage,
    previousPage,
    changeItemsPerPage,
  };
};


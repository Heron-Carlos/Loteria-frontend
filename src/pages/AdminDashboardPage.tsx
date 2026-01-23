import { useState, useCallback, useMemo } from 'react';
import { AdminDashboardPageProps } from '../types/pages.types';
import { useAuth } from '../hooks/useAuth.hook';
import { usePartnerBets } from '../hooks/usePartnerBets.hook';
import { usePartnerStats } from '../hooks/usePartnerStats.hook';
import { useBetActions } from '../hooks/useBetActions.hook';
import { useExportBets } from '../hooks/useExportBets.hook';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { FiltersBar } from '@/components/dashboard/FiltersBar';
import { BetsTable } from '@/components/dashboard/BetsTable';
import { Pagination } from '@/components/Pagination';
import { ExportMenu } from '@/components/dashboard/ExportMenu';

export const AdminDashboardPage = ({
  betService,
  authService,
}: AdminDashboardPageProps): JSX.Element => {
  const { user } = useAuth(authService);
  const [filteredGameType, setFilteredGameType] = useState<string | null>(null);
  const [exportGameType, setExportGameType] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isPaidFilter, setIsPaidFilter] = useState<boolean | null>(null);
  const [selectedBetIds, setSelectedBetIds] = useState<Set<string>>(new Set());

  const { 
    bets, 
    loading, 
    reloadBets,
    currentPage,
    totalPages,
    total,
    itemsPerPage,
    goToPage,
    nextPage,
    previousPage,
    changeItemsPerPage,
  } = usePartnerBets({
    betService,
    authService,
    user,
    filteredGameType,
    searchTerm,
    isPaidFilter,
  });

  const { stats, reloadStats } = usePartnerStats({
    betService,
    authService,
    user,
  });

  const handleReloadBets = useCallback(async () => {
    await reloadBets();
    await reloadStats();
  }, [reloadBets, reloadStats]);

  const { markAsPaid, deleteBet, markAsPaidBulk, deleteBetBulk } = useBetActions({
    betService,
    reloadBets: handleReloadBets,
  });

  const { exportBets } = useExportBets({
    betService,
    username: user?.username,
  });


  const handleFilterChange = useCallback((gameType: string | null): void => {
    setFilteredGameType(gameType);
    setSelectedBetIds(new Set());
  }, []);

  const handleExportGameTypeChange = useCallback((gameType: string | null): void => {
    setExportGameType(gameType);
  }, []);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      setSearchTerm(e.target.value);
      setSelectedBetIds(new Set());
    },
    []
  );

  const handleIsPaidFilterChange = useCallback((isPaid: boolean | null): void => {
    setIsPaidFilter(isPaid);
    setSelectedBetIds(new Set());
  }, []);

  const sortedBets = useMemo(
    () => {
      return [...bets].sort((a, b) => {
        const nameA = a.playerName.toUpperCase().trim();
        const nameB = b.playerName.toUpperCase().trim();
        return nameA.localeCompare(nameB, 'pt-BR');
      });
    },
    [bets]
  );

  const handleBetSelectionChange = useCallback((betId: string, checked: boolean): void => {
    setSelectedBetIds((prev) => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(betId);
      } else {
        newSet.delete(betId);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback((checked: boolean): void => {
    setSelectedBetIds(checked ? new Set(sortedBets.map((bet) => bet.id)) : new Set());
  }, [sortedBets]);

  const handleMarkAsPaidBulk = useCallback(async (isPaid: boolean): Promise<void> => {
    const betIds = Array.from(selectedBetIds);
    if (betIds.length === 0) {
      return;
    }
    await markAsPaidBulk(betIds, isPaid);
    setSelectedBetIds(new Set());
  }, [selectedBetIds, markAsPaidBulk]);

  const handleDeleteBulk = useCallback(async (): Promise<void> => {
    const betIds = Array.from(selectedBetIds);
    if (betIds.length === 0) {
      return;
    }
    await deleteBetBulk(betIds);
    setSelectedBetIds(new Set());
  }, [selectedBetIds, deleteBetBulk]);

  const isAllSelected = useMemo(() => {
    return sortedBets.length > 0 && sortedBets.every((bet) => selectedBetIds.has(bet.id));
  }, [sortedBets, selectedBetIds]);

  const isSomeSelected = useMemo(() => {
    return selectedBetIds.size > 0 && selectedBetIds.size < sortedBets.length;
  }, [selectedBetIds, sortedBets]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-4 sm:py-6 lg:py-8 max-w-7xl">
        <Card className="shadow-xl border-0">
          <DashboardHeader username={user?.username} />

          <CardContent className="space-y-6">
            <StatsCards stats={stats} />

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <FiltersBar
                filteredGameType={filteredGameType}
                exportGameType={exportGameType}
                isPaidFilter={isPaidFilter}
                onFilterChange={handleFilterChange}
                onExportGameTypeChange={handleExportGameTypeChange}
                onIsPaidFilterChange={handleIsPaidFilterChange}
                onExport={exportBets}
                hasBets={bets.length > 0}
              />
              <ExportMenu
                onExport={exportBets}
                hasBets={bets.length > 0}
              />
            </div>

            <Card className="border-2">
              <div className="p-4 border-b space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Apostas</h3>
                  <Button
                    onClick={handleReloadBets}
                    disabled={loading}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <svg
                      className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    {loading ? 'Carregando...' : 'Recarregar'}
                  </Button>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between w-full">
                  <div className="max-w-md w-full">
                    <Label htmlFor="search-player" className="sr-only">
                      Pesquisar por nome do jogador
                    </Label>
                    <div className="relative">
                      <svg
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      <Input
                        id="search-player"
                        type="text"
                        placeholder="Pesquisar por nome do jogador..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  {selectedBetIds.size > 0 && (
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="text-sm text-muted-foreground">
                        {selectedBetIds.size} selecionada(s)
                      </span>
                      <Button
                        onClick={() => handleMarkAsPaidBulk(true)}
                        variant="outline"
                        size="sm"
                        className="gap-2"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Marcar como Pago
                      </Button>
                      <Button
                        onClick={() => handleMarkAsPaidBulk(false)}
                        variant="outline"
                        size="sm"
                        className="gap-2"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                        Marcar como Pendente
                      </Button>
                      <Button
                        onClick={handleDeleteBulk}
                        variant="destructive"
                        size="sm"
                        className="gap-2"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Excluir
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              <CardContent className="p-0">
                <BetsTable
                  bets={sortedBets}
                  loading={loading}
                  filteredGameType={filteredGameType}
                  selectedBetIds={selectedBetIds}
                  isAllSelected={isAllSelected}
                  isSomeSelected={isSomeSelected}
                  onBetSelectionChange={handleBetSelectionChange}
                  onSelectAll={handleSelectAll}
                  onMarkAsPaid={markAsPaid}
                  onDelete={deleteBet}
                />
                {!loading && bets.length > 0 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    total={total}
                    itemsPerPage={itemsPerPage}
                    onPageChange={goToPage}
                    onItemsPerPageChange={changeItemsPerPage}
                    onNext={nextPage}
                    onPrevious={previousPage}
                  />
                )}
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { IBetService } from '../interfaces/services.interface';
import { IAuthService } from '../interfaces/services.interface';
import { useAuth } from '../hooks/useAuth.hook';
import { usePartnerBets } from '../hooks/usePartnerBets.hook';
import { useBetActions } from '../hooks/useBetActions.hook';
import { useExportBets } from '../hooks/useExportBets.hook';
import { Card, CardContent } from '@/components/ui/card';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { FiltersBar } from '@/components/dashboard/FiltersBar';
import { BetsTable } from '@/components/dashboard/BetsTable';
import { calculateStats, filterBetsByGameType } from '@/utils/dashboard.utils';

type AdminDashboardPageProps = {
  betService: IBetService;
  authService: IAuthService;
};

export const AdminDashboardPage = ({
  betService,
  authService,
}: AdminDashboardPageProps): JSX.Element => {
  const navigate = useNavigate();
  const { user, logout } = useAuth(authService);
  const [filteredGameType, setFilteredGameType] = useState<string | null>(null);
  const [exportGameType, setExportGameType] = useState<string | null>(null);

  const { bets, loading, reloadBets } = usePartnerBets({
    betService,
    authService,
    user,
    filteredGameType,
  });

  const { markAsPaid, deleteBet } = useBetActions({
    betService,
    reloadBets,
  });

  const { exportBets } = useExportBets({
    betService,
    betsCount: bets.length,
    exportGameType,
    username: user?.username,
  });

  const handleLogout = useCallback((): void => {
    logout();
    navigate('/login');
  }, [logout, navigate]);

  const handleFilterChange = useCallback((gameType: string | null): void => {
    setFilteredGameType(gameType);
  }, []);

  const handleExportGameTypeChange = useCallback((gameType: string | null): void => {
    setExportGameType(gameType);
  }, []);

  const filteredBets = useMemo(
    () => filterBetsByGameType(bets, filteredGameType),
    [bets, filteredGameType]
  );

  const stats = useMemo(() => calculateStats(filteredBets), [filteredBets]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Card className="shadow-xl border-0">
          <DashboardHeader username={user?.username} onLogout={handleLogout} />

          <CardContent className="space-y-6">
            <StatsCards stats={stats} />

            <FiltersBar
              filteredGameType={filteredGameType}
              exportGameType={exportGameType}
              onFilterChange={handleFilterChange}
              onExportGameTypeChange={handleExportGameTypeChange}
              onExport={exportBets}
              hasBets={bets.length > 0}
            />

            <Card className="border-2">
              <CardContent className="p-0">
                <BetsTable
                  bets={filteredBets}
                  loading={loading}
                  filteredGameType={filteredGameType}
                  onMarkAsPaid={markAsPaid}
                  onDelete={deleteBet}
                />
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

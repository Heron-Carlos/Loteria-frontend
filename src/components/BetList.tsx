import { useMemo, memo, useCallback } from 'react';
import { Bet } from '../types/bet.types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrashIcon } from '@/components/icons';

type BetListProps = {
  bets: Bet[];
  onDelete: (bet: Bet) => void;
};

const getColorClasses = (gameType: string): {
  bg: string;
  border: string;
  badge: string;
} => {
  if (gameType === 'Mega') {
    return {
      bg: 'bg-green-50',
      border: 'border-green-500',
      badge: 'bg-green-500',
    };
  }
  return {
    bg: 'bg-blue-50',
    border: 'border-blue-500',
    badge: 'bg-blue-500',
  };
};

const sortNumbers = (numbers: number[]): number[] => {
  return [...numbers].sort((a, b) => a - b);
};

type BetCardProps = {
  bet: Bet;
  onDelete: (bet: Bet) => void;
};

const BetCard = memo<BetCardProps>(({ bet, onDelete }) => {
  const sortedNumbers = useMemo(
    () => sortNumbers(bet.selectedNumbers),
    [bet.selectedNumbers]
  );
  const colors = useMemo(() => getColorClasses(bet.gameType), [bet.gameType]);

  const handleDelete = useCallback(() => {
    onDelete(bet);
  }, [bet, onDelete]);

  return (
    <Card
      className={`${colors.bg} border-l-4 ${colors.border} shadow-sm`}
    >
      <CardContent className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <p className="font-bold text-base sm:text-lg mb-2 truncate">
              {bet.playerName}
            </p>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {sortedNumbers.map((num) => (
                <span
                  key={num}
                  className="bg-white rounded-full w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center font-semibold text-xs sm:text-sm shadow-sm border border-gray-200"
                >
                  {num}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 sm:flex-col sm:items-end">
            <Badge
              className={`${colors.badge} text-white text-xs sm:text-sm px-2 sm:px-3 py-1 uppercase`}
            >
              {bet.gameType}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              className="h-8 w-8 sm:h-9 sm:w-9 text-red-600 hover:text-red-700 hover:bg-red-50"
              title="Remover aposta"
            >
              <TrashIcon />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
BetCard.displayName = 'BetCard';

export const BetList = ({ bets, onDelete }: BetListProps): JSX.Element => {
  if (bets.length === 0) {
    return (
      <div className="mt-6 text-center text-gray-500 text-sm sm:text-base">
        Nenhuma aposta ainda.
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-3 sm:space-y-4">
      <h2 className="text-center text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
        Apostas Realizadas
      </h2>

      {bets.map((bet) => (
        <BetCard key={bet.id} bet={bet} onDelete={onDelete} />
      ))}
    </div>
  );
};


import { useMemo } from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircleIcon, XCircleIcon, TrashIcon } from '@/components/icons';
import { Bet } from '@/types/bet.types';
import { cn } from '@/lib/utils';
import { sortNumbers } from '@/utils/bet.utils';

type BetTableRowProps = {
  bet: Bet;
  index: number;
  isSelected: boolean;
  onSelectionChange: (betId: string, checked: boolean) => void;
  onMarkAsPaid: (betId: string, currentStatus: boolean) => void;
  onDelete: (betId: string) => void;
};

export const BetTableRow = ({
  bet,
  index,
  isSelected,
  onSelectionChange,
  onMarkAsPaid,
  onDelete,
}: BetTableRowProps): JSX.Element => {
  const sortedNumbers = useMemo(() => sortNumbers(bet.selectedNumbers), [bet.selectedNumbers]);
  const isMega = bet.gameType === 'Mega';

  return (
    <TableRow
      className={cn(
        'hover:bg-muted/50 transition-colors',
        isMega ? 'bg-green-50/50' : 'bg-blue-50/50',
        isSelected && 'bg-primary/5'
      )}
    >
      <TableCell>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelectionChange(bet.id, e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
        />
      </TableCell>
      <TableCell className="font-medium">{index + 1}</TableCell>
      <TableCell className="font-medium">{bet.playerName}</TableCell>
      <TableCell>
        <Badge variant={isMega ? 'success' : 'default'}>
          {bet.gameType.toUpperCase()}
        </Badge>
      </TableCell>
      {sortedNumbers.map((num: number) => (
        <TableCell key={num} className="text-center font-semibold">
          {num}
        </TableCell>
      ))}
      <TableCell className="text-center">
        <Badge variant={bet.isPaid ? 'success' : 'secondary'}>
          {bet.isPaid ? 'PAGO' : 'PENDENTE'}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onMarkAsPaid(bet.id, bet.isPaid)}
            className={cn(
              'h-8 w-8',
              bet.isPaid
                ? 'text-muted-foreground hover:text-foreground'
                : 'text-green-600 hover:text-green-700 hover:bg-green-50'
            )}
            title={bet.isPaid ? 'Desmarcar como não pago' : 'Marcar como pago'}
          >
            {bet.isPaid ? <XCircleIcon /> : <CheckCircleIcon />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(bet.id)}
            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
            title="Excluir aposta"
          >
            <TrashIcon />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};


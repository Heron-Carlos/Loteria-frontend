import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { FilterIcon } from '@/components/icons';
import { Bet } from '@/types/bet.types';
import { BetTableRow } from './BetTableRow';

type BetsTableProps = {
  bets: Bet[];
  loading: boolean;
  filteredGameType: string | null;
  selectedBetIds: Set<string>;
  isAllSelected: boolean;
  isSomeSelected: boolean;
  onBetSelectionChange: (betId: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onMarkAsPaid: (betId: string, currentStatus: boolean) => void;
  onDelete: (betId: string) => void;
};

const BetTableSkeleton = (): JSX.Element => (
  <>
    {Array.from({ length: 5 }).map((_, index) => (
      <TableRow key={index}>
        <TableCell>
          <Skeleton className="h-4 w-4" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-8" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-32" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-6 w-16" />
        </TableCell>
        {Array.from({ length: 10 }).map((_, i) => (
          <TableCell key={i}>
            <Skeleton className="h-4 w-8 mx-auto" />
          </TableCell>
        ))}
        <TableCell>
          <Skeleton className="h-6 w-20 mx-auto" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-8 w-16 mx-auto" />
        </TableCell>
      </TableRow>
    ))}
  </>
);

const EmptyState = ({ filteredGameType }: { filteredGameType: string | null }): JSX.Element => (
  <TableRow>
    <TableCell colSpan={16} className="text-center py-12">
      <div className="flex flex-col items-center gap-2 text-muted-foreground">
        <span className="opacity-50">
          <FilterIcon />
        </span>
        <p className="text-lg font-medium">Nenhuma aposta encontrada</p>
        <p className="text-sm">
          {filteredGameType
            ? `Não há apostas do tipo ${filteredGameType}`
            : 'Não há apostas para este sócio'}
        </p>
      </div>
    </TableCell>
  </TableRow>
);

export const BetsTable = ({
  bets,
  loading,
  filteredGameType,
  selectedBetIds,
  isAllSelected,
  isSomeSelected,
  onBetSelectionChange,
  onSelectAll,
  onMarkAsPaid,
  onDelete,
}: BetsTableProps): JSX.Element => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={(e) => onSelectAll(e.target.checked)}
                ref={(input) => {
                  if (input) input.indeterminate = isSomeSelected;
                }}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
              />
            </TableHead>
            <TableHead className="w-12">#</TableHead>
            <TableHead>Jogador</TableHead>
            <TableHead>Jogo</TableHead>
            <TableHead colSpan={10} className="text-center">
              Números Selecionados
            </TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <BetTableSkeleton />
          ) : bets.length === 0 ? (
            <EmptyState filteredGameType={filteredGameType} />
          ) : (
            bets.map((bet: Bet, index: number) => (
              <BetTableRow
                key={bet.id}
                bet={bet}
                index={index}
                isSelected={selectedBetIds.has(bet.id)}
                onSelectionChange={onBetSelectionChange}
                onMarkAsPaid={onMarkAsPaid}
                onDelete={onDelete}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};


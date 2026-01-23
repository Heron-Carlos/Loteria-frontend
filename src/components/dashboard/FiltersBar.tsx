import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FilterIcon } from '@/components/icons';
import { GAME_TYPES } from '@/constants/dashboard.constants';

type FiltersBarProps = {
  filteredGameType: string | null;
  exportGameType: string | null;
  isPaidFilter: boolean | null;
  onFilterChange: (gameType: string | null) => void;
  onExportGameTypeChange: (gameType: string | null) => void;
  onIsPaidFilterChange: (isPaid: boolean | null) => void;
  onExport: () => void;
  hasBets: boolean;
};

export const FiltersBar = ({
  filteredGameType,
  isPaidFilter,
  onFilterChange,
  onIsPaidFilterChange,
}: FiltersBarProps): JSX.Element => {
  return (
    <div className="flex flex-wrap gap-2">
      {GAME_TYPES.map((type) => (
        <Button
          key={type.value || 'all'}
          variant={filteredGameType === type.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => onFilterChange(type.value)}
          className="flex items-center gap-2"
        >
          <span>
            <FilterIcon />
          </span>
          {type.label}
        </Button>
      ))}
      <Select
        value={isPaidFilter === null ? 'all' : isPaidFilter ? 'paid' : 'pending'}
        onValueChange={(value: string) => {
          if (value === 'all') {
            onIsPaidFilterChange(null);
          } else if (value === 'paid') {
            onIsPaidFilterChange(true);
          } else {
            onIsPaidFilterChange(false);
          }
        }}
      >
        <SelectTrigger className="w-full sm:w-[150px]">
          <SelectValue placeholder="Status..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="paid">Pago</SelectItem>
          <SelectItem value="pending">Pendente</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};


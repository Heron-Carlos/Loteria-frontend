import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FilterIcon, DownloadIcon } from '@/components/icons';
import { GAME_TYPES, EXPORT_OPTIONS } from '@/constants/dashboard.constants';

type FiltersBarProps = {
  filteredGameType: string | null;
  exportGameType: string | null;
  onFilterChange: (gameType: string | null) => void;
  onExportGameTypeChange: (gameType: string | null) => void;
  onExport: () => void;
  hasBets: boolean;
};

export const FiltersBar = ({
  filteredGameType,
  exportGameType,
  onFilterChange,
  onExportGameTypeChange,
  onExport,
  hasBets,
}: FiltersBarProps): JSX.Element => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
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
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <Select
          value={exportGameType || 'all'}
          onValueChange={(value: string) =>
            onExportGameTypeChange(value === 'all' ? null : value)
          }
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Exportar..." />
          </SelectTrigger>
          <SelectContent>
            {EXPORT_OPTIONS.map((option) => (
              <SelectItem key={option.value || 'all'} value={option.value || 'all'}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          onClick={onExport}
          variant="outline"
          className="w-full sm:w-auto"
          disabled={!hasBets}
        >
          <span className="mr-2">
            <DownloadIcon />
          </span>
          Exportar Excel
        </Button>
      </div>
    </div>
  );
};


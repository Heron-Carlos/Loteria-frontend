import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DownloadIcon } from '@/components/icons';

type ExportOption = {
  label: string;
  gameType?: string;
  isPaid?: boolean;
};

type ExportMenuProps = {
  onExport: (gameType?: string, isPaid?: boolean) => Promise<void>;
  hasBets: boolean;
};

export const ExportMenu = ({ onExport, hasBets }: ExportMenuProps): JSX.Element => {
  const [isExporting, setIsExporting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExport = async (gameType?: string, isPaid?: boolean): Promise<void> => {
    setIsOpen(false);
    setIsExporting(true);
    try {
      await onExport(gameType, isPaid);
    } finally {
      setIsExporting(false);
    }
  };

  const exportOptions: ExportOption[] = [
    { label: '📊 Todas as Apostas' },
    { label: '🎰 Todas Mega', gameType: 'Mega' },
    { label: '🎯 Todas Quina', gameType: 'Quina' },
  ];

  const exportPendingOptions: ExportOption[] = [
    { label: '⏳ Pendentes (Todas)', isPaid: false },
    { label: '⏳ Pendentes Mega', gameType: 'Mega', isPaid: false },
    { label: '⏳ Pendentes Quina', gameType: 'Quina', isPaid: false },
  ];

  const exportPaidOptions: ExportOption[] = [
    { label: '✅ Pagas (Todas)', isPaid: true },
    { label: '✅ Pagas Mega', gameType: 'Mega', isPaid: true },
    { label: '✅ Pagas Quina', gameType: 'Quina', isPaid: true },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="outline"
        className="w-full sm:w-auto"
        disabled={!hasBets || isExporting}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="mr-2">
          <DownloadIcon />
        </span>
        {isExporting ? 'Exportando...' : 'Exportar Excel'}
        <svg
          className="ml-2 h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-50 border border-gray-200 py-1">
          <div className="px-3 py-2 text-sm font-semibold text-gray-700 border-b">
            Exportar Todas
          </div>
          {exportOptions.map((option, index) => (
            <button
              key={index}
              onClick={() => handleExport(option.gameType, option.isPaid)}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
            >
              {option.label}
            </button>
          ))}

          <div className="border-t my-1"></div>

          <div className="px-3 py-2 text-sm font-semibold text-yellow-700 border-b">
            Exportar Pendentes
          </div>
          {exportPendingOptions.map((option, index) => (
            <button
              key={index}
              onClick={() => handleExport(option.gameType, option.isPaid)}
              className="w-full text-left px-4 py-2 text-sm text-yellow-700 hover:bg-yellow-50 transition-colors"
            >
              {option.label}
            </button>
          ))}

          <div className="border-t my-1"></div>

          <div className="px-3 py-2 text-sm font-semibold text-green-700 border-b">
            Exportar Pagas
          </div>
          {exportPaidOptions.map((option, index) => (
            <button
              key={index}
              onClick={() => handleExport(option.gameType, option.isPaid)}
              className="w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-green-50 transition-colors"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};


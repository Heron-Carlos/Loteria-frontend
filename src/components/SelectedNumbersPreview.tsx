import { useMemo, memo } from 'react';

type SelectedNumbersPreviewProps = {
  selectedNumbers: number[];
};

export const SelectedNumbersPreview = memo<SelectedNumbersPreviewProps>(
  ({ selectedNumbers }) => {
    const sortedNumbers = useMemo(
      () => [...selectedNumbers].sort((a, b) => a - b),
      [selectedNumbers]
    );

    if (sortedNumbers.length === 0) {
      return (
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs sm:text-sm text-gray-500 text-center">
            Nenhum número selecionado
          </p>
        </div>
      );
    }

    return (
      <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 text-center sm:text-left">
          Números selecionados ({sortedNumbers.length}/10):
        </p>
        <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center sm:justify-start">
          {sortedNumbers.map((num) => (
            <span
              key={num}
              className="px-2 sm:px-3 py-1 bg-white border border-gray-300 rounded-full text-xs sm:text-sm font-medium text-gray-700 shadow-sm"
            >
              {num}
            </span>
          ))}
        </div>
      </div>
    );
  }
);
SelectedNumbersPreview.displayName = 'SelectedNumbersPreview';


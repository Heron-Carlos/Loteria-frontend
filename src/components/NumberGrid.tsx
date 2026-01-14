import { useMemo, memo } from 'react';

type NumberGridProps = {
  totalNumbers: number;
  selectedNumbers: number[];
  onToggleNumber: (num: number) => void;
  selectedColor: string;
  maxSelections: number;
};

const NumberButton = memo<{
  num: number;
  isSelected: boolean;
  isDisabled: boolean;
  selectedColor: string;
  onToggle: () => void;
}>(({ num, isSelected, isDisabled, selectedColor, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      disabled={isDisabled}
      className={`aspect-square w-full border-none rounded-full font-bold text-sm sm:text-base transition-all duration-200 ${
        isSelected
          ? 'text-white cursor-pointer shadow-md'
          : isDisabled
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300 active:scale-95 cursor-pointer'
      }`}
      style={isSelected ? { backgroundColor: selectedColor } : undefined}
    >
      {num}
    </button>
  );
});
NumberButton.displayName = 'NumberButton';

export const NumberGrid = memo<NumberGridProps>(
  ({
    totalNumbers,
    selectedNumbers,
    onToggleNumber,
    selectedColor,
    maxSelections,
  }) => {
    const numbers = useMemo(
      () => Array.from({ length: totalNumbers }, (_, i) => i + 1),
      [totalNumbers]
    );

    const isMaxReached = selectedNumbers.length >= maxSelections;
    const selectedSet = useMemo(
      () => new Set(selectedNumbers),
      [selectedNumbers]
    );

    return (
      <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 sm:gap-3 mb-4 sm:mb-6">
        {numbers.map((num) => {
          const isSelected = selectedSet.has(num);
          const isDisabled = !isSelected && isMaxReached;

          return (
            <NumberButton
              key={num}
              num={num}
              isSelected={isSelected}
              isDisabled={isDisabled}
              selectedColor={selectedColor}
              onToggle={() => onToggleNumber(num)}
            />
          );
        })}
      </div>
    );
  }
);
NumberGrid.displayName = 'NumberGrid';


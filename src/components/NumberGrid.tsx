import { memo } from 'react';
import { formatSequentialNumber } from '../utils/bet.utils';
import { NumberGridProps, NumberButtonProps } from '../types/component.types';

const NumberButton = memo<NumberButtonProps>(({ 
  num, 
  isSelected, 
  isDisabled, 
  selectedColor, 
  onClick 
}) => {
  const baseClasses = 'aspect-square w-full border-none rounded-full font-bold text-sm sm:text-base touch-manipulation transition-transform duration-75';
  
  const className = isSelected
    ? `${baseClasses} text-white cursor-pointer shadow-md active:scale-95`
    : isDisabled
    ? `${baseClasses} bg-gray-100 text-gray-400 cursor-not-allowed`
    : `${baseClasses} bg-gray-200 text-gray-700 hover:bg-gray-300 active:scale-95 cursor-pointer`;

  const style = isSelected ? { backgroundColor: selectedColor } : undefined;

  return (
    <button
      type="button"
      onClick={() => onClick(num)}
      disabled={isDisabled}
      className={className}
      style={style}
      aria-label={`Número ${num}`}
    >
      {formatSequentialNumber(num)}
    </button>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.num === nextProps.num &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.isDisabled === nextProps.isDisabled &&
    prevProps.selectedColor === nextProps.selectedColor &&
    prevProps.onClick === nextProps.onClick
  );
});

NumberButton.displayName = 'NumberButton';

export const NumberGrid = memo<NumberGridProps>(({
  totalNumbers,
  selectedNumbers,
  onToggleNumber,
  selectedColor,
  maxSelections,
}) => {
  const selectedSet = new Set(selectedNumbers);
  const isMaxReached = selectedNumbers.length >= maxSelections;

  return (
    <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 sm:gap-3 mb-4 sm:mb-6">
      {Array.from({ length: totalNumbers }, (_, i) => {
        const num = i + 1;
        const isSelected = selectedSet.has(num);
        const isDisabled = !isSelected && isMaxReached;

        return (
          <NumberButton
            key={num}
            num={num}
            isSelected={isSelected}
            isDisabled={isDisabled}
            selectedColor={selectedColor}
            onClick={onToggleNumber}
          />
        );
      })}
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.totalNumbers === nextProps.totalNumbers &&
    prevProps.selectedNumbers.length === nextProps.selectedNumbers.length &&
    prevProps.selectedNumbers.every((num, idx) => num === nextProps.selectedNumbers[idx]) &&
    prevProps.selectedColor === nextProps.selectedColor &&
    prevProps.maxSelections === nextProps.maxSelections &&
    prevProps.onToggleNumber === nextProps.onToggleNumber
  );
});

NumberGrid.displayName = 'NumberGrid';

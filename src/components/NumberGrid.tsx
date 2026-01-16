import { memo, useCallback, useMemo } from 'react';
import { formatSequentialNumber } from '../utils/bet.utils';
import { NumberGridProps, NumberButtonProps } from '../types/component.types';

const NumberButton = memo<NumberButtonProps>(({ 
  num, 
  isSelected, 
  isDisabled, 
  selectedColor, 
  onClick 
}) => {
  const handleClick = useCallback(() => {
    onClick(num);
  }, [onClick, num]);

  const buttonStyle = useMemo(() => {
    return isSelected ? { backgroundColor: selectedColor } : undefined;
  }, [isSelected, selectedColor]);

  const className = useMemo(() => {
    const baseClasses = 'aspect-square w-full border-none rounded-full font-bold text-sm sm:text-base';
    
    if (isSelected) {
      return `${baseClasses} text-white cursor-pointer shadow-md`;
    }
    
    if (isDisabled) {
      return `${baseClasses} bg-gray-100 text-gray-400 cursor-not-allowed`;
    }
    
    return `${baseClasses} bg-gray-200 text-gray-700 hover:bg-gray-300 active:scale-[0.98] cursor-pointer`;
  }, [isSelected, isDisabled]);

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isDisabled}
      className={className}
      style={buttonStyle}
    >
      {formatSequentialNumber(num)}
    </button>
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
  const numbers = useMemo(
    () => Array.from({ length: totalNumbers }, (_, i) => i + 1),
    [totalNumbers]
  );

  const selectedSet = useMemo(
    () => new Set(selectedNumbers),
    [selectedNumbers]
  );

  const isMaxReached = selectedNumbers.length >= maxSelections;

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
            onClick={onToggleNumber}
          />
        );
      })}
    </div>
  );
});

NumberGrid.displayName = 'NumberGrid';

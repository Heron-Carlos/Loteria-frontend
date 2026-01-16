import { formatSequentialNumber } from '../utils/bet.utils';

type NumberGridProps = {
  totalNumbers: number;
  selectedNumbers: number[];
  onToggleNumber: (num: number) => void;
  selectedColor: string;
  maxSelections: number;
};

type NumberButtonProps = {
  num: number;
  isSelected: boolean;
  isDisabled: boolean;
  selectedColor: string;
  onClick: () => void;
};

const NumberButton = ({ num, isSelected, isDisabled, selectedColor, onClick }: NumberButtonProps): JSX.Element => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      className={`aspect-square w-full border-none rounded-full font-bold text-sm sm:text-base ${
        isSelected
          ? 'text-white cursor-pointer shadow-md'
          : isDisabled
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300 active:scale-[0.98] cursor-pointer'
      }`}
      style={isSelected ? { backgroundColor: selectedColor } : undefined}
    >
      {formatSequentialNumber(num)}
    </button>
  );
};

export const NumberGrid = ({
  totalNumbers,
  selectedNumbers,
  onToggleNumber,
  selectedColor,
  maxSelections,
}: NumberGridProps): JSX.Element => {
  const numbers = Array.from({ length: totalNumbers }, (_, i) => i + 1);
  const isMaxReached = selectedNumbers.length >= maxSelections;
  const selectedSet = new Set(selectedNumbers);

  const handleClick = (num: number): void => {
    onToggleNumber(num);
  };

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
            onClick={() => handleClick(num)}
          />
        );
      })}
    </div>
  );
};


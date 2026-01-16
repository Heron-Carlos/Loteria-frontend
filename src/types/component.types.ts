export type NumberGridProps = {
  totalNumbers: number;
  selectedNumbers: number[];
  onToggleNumber: (num: number) => void;
  selectedColor: string;
  maxSelections: number;
};

export type NumberButtonProps = {
  num: number;
  isSelected: boolean;
  isDisabled: boolean;
  selectedColor: string;
  onClick: (num: number) => void;
};

export type SelectedNumbersPreviewProps = {
  selectedNumbers: number[];
};

export type GameType = 'Mega' | 'Quina';

export type GameConfig = {
  type: GameType;
  totalNumbers: number;
  maxSelections: number;
  selectedColor: string;
  title: string;
  gradientFrom: string;
  gradientTo: string;
  bgGradient: string;
  buttonColor: string;
  buttonHoverColor: string;
};


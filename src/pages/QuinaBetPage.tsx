import { BetPageProps } from '../types/pages.types';
import { GameConfig } from '../types/component.types';
import { BetPage } from '../components/BetPage';

const QUINA_CONFIG: GameConfig = {
  type: 'Quina' as const,
  totalNumbers: 80,
  maxSelections: 10,
  selectedColor: '#2563eb',
  title: 'Nova Aposta - QUINA',
  gradientFrom: 'from-blue-600',
  gradientTo: 'to-blue-800',
  bgGradient: 'bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100',
  buttonColor: 'bg-green-600',
  buttonHoverColor: 'hover:bg-green-700',
};

export const QuinaBetPage = (props: BetPageProps): JSX.Element => {
  return <BetPage {...props} gameConfig={QUINA_CONFIG} />;
};

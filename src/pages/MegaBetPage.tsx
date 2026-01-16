import { BetPageProps } from '../types/pages.types';
import { GameConfig } from '../types/component.types';
import { BetPage } from '../components/BetPage';

const MEGA_CONFIG: GameConfig = {
  type: 'Mega' as const,
  totalNumbers: 60,
  maxSelections: 10,
  selectedColor: '#16a34a',
  title: 'Nova Aposta - MEGA',
  gradientFrom: 'from-green-600',
  gradientTo: 'to-green-800',
  bgGradient: 'bg-gradient-to-br from-slate-50 via-green-50 to-slate-100',
  buttonColor: 'bg-green-600',
  buttonHoverColor: 'hover:bg-green-700',
};

export const MegaBetPage = (props: BetPageProps): JSX.Element => {
  return <BetPage {...props} gameConfig={MEGA_CONFIG} />;
};

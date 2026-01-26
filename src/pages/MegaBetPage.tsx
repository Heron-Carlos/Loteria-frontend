import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { BetPageProps } from '../types/pages.types';
import { GameConfig } from '../types/component.types';
import { BetPage } from '../components/BetPage';
import { Partner } from '../types/auth.types';
import { fetchPartnerByUsername } from '../utils/partner.utils';
import toast from 'react-hot-toast';

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
  const { partnerUsername } = useParams<{ partnerUsername?: string }>();
  const [filteredPartner, setFilteredPartner] = useState<Partner | null>(null);
  const [loading, setLoading] = useState(false);

  const loadPartner = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const partner = await fetchPartnerByUsername(
        props.authService,
        partnerUsername,
        'Mega'
      );

      if (!partner && partnerUsername) {
        toast.error('Sócio não encontrado ou não possui sigla para Mega.');
      }

      setFilteredPartner(partner);
    } catch {
      if (partnerUsername) {
        toast.error('Erro ao buscar informações do sócio.');
      }
      setFilteredPartner(null);
    } finally {
      setLoading(false);
    }
  }, [partnerUsername, props.authService]);

  useEffect(() => {
    loadPartner();
  }, [loadPartner]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <BetPage
      {...props}
      gameConfig={MEGA_CONFIG}
      filteredPartner={filteredPartner}
      isDefaultRoute={!partnerUsername}
    />
  );
};

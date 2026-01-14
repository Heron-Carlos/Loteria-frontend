import { useState, useEffect, useCallback, useMemo } from 'react';
import { BetPageProps } from '../types/pages.types';
import { GAME_CONFIG } from '../constants/game.constants';
import { useBets } from '../hooks/useBets.hook';
import { useAuth } from '../hooks/useAuth.hook';
import { NumberGrid } from '../components/NumberGrid';
import { SelectedNumbersPreview } from '../components/SelectedNumbersPreview';
import { BetList } from '../components/BetList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatPartnerName } from '../utils/formatName';
import { filterValidPartners } from '../utils/validatePartners';
import { validateBetForm } from '../utils/validators/bet.validator';
import { createBet, prepareBetsForSending } from '../utils/betCreation';
import { confirmSendBets } from '../utils/confirmations';
import { handlePlayerNameChange } from '../utils/formHandlers';
import toast from 'react-hot-toast';

const GAME_CONFIG_QUINA = GAME_CONFIG.Quina;

export const QuinaBetPage = ({ betService, authService }: BetPageProps): JSX.Element => {
  const { partners } = useAuth(authService);
  const { bets, addBet, removeBet, clearBets } = useBets(betService, GAME_CONFIG_QUINA.type);

  const [playerName, setPlayerName] = useState('');
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [selectedPartnerId, setSelectedPartnerId] = useState('');
  const [isSending, setIsSending] = useState(false);

  const validPartners = useMemo(() => filterValidPartners(partners), [partners]);

  useEffect(() => {
    if (validPartners.length > 0 && !selectedPartnerId) {
      setSelectedPartnerId(validPartners[0].partnerId);
    }
  }, [validPartners, selectedPartnerId]);

  const toggleNumber = useCallback(
    (num: number): void => {
      setSelectedNumbers((prev) => {
        if (prev.includes(num)) {
          return prev.filter((n) => n !== num);
        }

        if (prev.length < GAME_CONFIG_QUINA.maxSelections) {
          return [...prev, num];
        }

        return prev;
      });
    },
    []
  );

  const handleAddBet = useCallback((): void => {
    const validation = validateBetForm({
      playerName,
      selectedPartnerId,
      selectedNumbers,
      maxSelections: GAME_CONFIG_QUINA.maxSelections,
      gameType: GAME_CONFIG_QUINA.type,
    });

    if (!validation.isValid) {
      toast.error(validation.error || 'Erro de validação.');
      return;
    }

    const newBet = createBet({
      playerName,
      gameType: GAME_CONFIG_QUINA.type,
      selectedNumbers,
      partnerId: selectedPartnerId,
    });

    addBet(newBet);
    setSelectedNumbers([]);
    toast.success('Aposta na Quina adicionada com sucesso!');
  }, [playerName, selectedNumbers, selectedPartnerId, addBet]);

  const handleSendBets = async (): Promise<void> => {
    if (bets.length === 0) {
      toast.error('Não há apostas da Quina para enviar!');
      return;
    }

    const confirmed = await confirmSendBets({ gameType: GAME_CONFIG_QUINA.type });
    if (!confirmed) {
      return;
    }

    const betsToSend = prepareBetsForSending({ bets, defaultPartnerId: selectedPartnerId });

    setIsSending(true);
    try {
      await betService.sendFilteredBets(betsToSend);
      toast.success('Apostas da Quina enviadas com sucesso!');
      clearBets();
    } catch (error) {
      toast.error('Erro ao enviar apostas da Quina.');
    } finally {
      setIsSending(false);
    }
  };

  const handlePlayerNameChangeCallback = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    handlePlayerNameChange(e, setPlayerName);
  }, []);

  const handlePartnerChange = useCallback((value: string): void => {
    setSelectedPartnerId(value);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6 lg:py-8">
        <Card className="shadow-xl border-0">
          <CardHeader className="pb-4 sm:pb-6">
            <CardTitle className="text-xl sm:text-2xl lg:text-3xl text-center bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Nova Aposta - QUINA
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="player-name">Nome do Jogador</Label>
              <Input
                id="player-name"
                type="text"
                value={playerName}
                onChange={handlePlayerNameChangeCallback}
                placeholder="Digite o nome do jogador"
                className="h-10 sm:h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="partner-select">Sócio Responsável</Label>
              <Select value={selectedPartnerId} onValueChange={handlePartnerChange}>
                <SelectTrigger id="partner-select" className="h-10 sm:h-11">
                  <SelectValue
                    placeholder={
                      validPartners.length === 0
                        ? 'Nenhum sócio disponível'
                        : 'Selecione o sócio'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {validPartners.map((partner) => {
                    const displayName = formatPartnerName(partner.username);
                    return (
                      <SelectItem key={partner.id} value={partner.partnerId}>
                        {displayName} - {partner.quinaSigla}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-3 block">Selecione {GAME_CONFIG_QUINA.maxSelections} números</Label>
              <NumberGrid
                totalNumbers={GAME_CONFIG_QUINA.totalNumbers}
                selectedNumbers={selectedNumbers}
                onToggleNumber={toggleNumber}
                selectedColor={GAME_CONFIG_QUINA.selectedColor}
                maxSelections={GAME_CONFIG_QUINA.maxSelections}
              />
            </div>

            <SelectedNumbersPreview selectedNumbers={selectedNumbers} />

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
              <Button
                onClick={handleAddBet}
                className="w-full sm:flex-1 h-11 text-base font-semibold"
              >
                Adicionar Aposta
              </Button>
              <Button
                onClick={handleSendBets}
                variant="default"
                disabled={isSending}
                className="w-full sm:flex-1 h-11 text-base font-semibold bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSending ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Enviando...
                  </span>
                ) : (
                  'Enviar Todas Apostas'
                )}
              </Button>
            </div>

            <BetList bets={bets} onDelete={removeBet} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

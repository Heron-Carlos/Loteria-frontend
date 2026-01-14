import { useState, useEffect, useCallback, useMemo } from 'react';
import { IBetService } from '../interfaces/services.interface';
import { IAuthService } from '../interfaces/services.interface';
import { useBets } from '../hooks/useBets.hook';
import { useAuth } from '../hooks/useAuth.hook';
import { Bet } from '../types/bet.types';
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
import { generateUUID } from '../utils/uuid';
import { formatPartnerName } from '../utils/formatName';
import { filterValidPartners } from '../utils/validatePartners';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

type MegaBetPageProps = {
  betService: IBetService;
  authService: IAuthService;
};

const GAME_TYPE = 'Mega' as const;
const TOTAL_NUMBERS = 60;
const MAX_SELECTIONS = 10;
const SELECTED_COLOR = '#2e7d32';

export const MegaBetPage = ({
  betService,
  authService,
}: MegaBetPageProps): JSX.Element => {
  const { partners } = useAuth(authService);
  const { bets, addBet, removeBet, clearBets } = useBets(betService, GAME_TYPE);

  const [playerName, setPlayerName] = useState('');
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [selectedPartnerId, setSelectedPartnerId] = useState('');

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

        if (prev.length < MAX_SELECTIONS) {
          return [...prev, num];
        }

        return prev;
      });
    },
    []
  );

  const validateForm = useCallback((): string | null => {
    const trimmedName = playerName.trim();

    if (!trimmedName) {
      return 'Preencha o nome do jogador.';
    }

    if (!selectedPartnerId) {
      return 'Selecione um sócio responsável pela aposta.';
    }

    if (selectedNumbers.length < MAX_SELECTIONS) {
      return `Selecione ${MAX_SELECTIONS} números para a Mega. Você selecionou ${selectedNumbers.length}.`;
    }

    return null;
  }, [playerName, selectedPartnerId, selectedNumbers]);

  const handleAddBet = useCallback((): void => {
    const validationError = validateForm();

    if (validationError) {
      toast.error(validationError);
      return;
    }

    const newBet: Bet = {
      id: generateUUID(),
      playerName: playerName.trim(),
      gameType: GAME_TYPE,
      selectedNumbers: [...selectedNumbers].sort((a, b) => a - b),
      isPaid: false,
      partnerId: selectedPartnerId,
    };

    addBet(newBet);
    setSelectedNumbers([]);
    toast.success('Aposta na Mega adicionada com sucesso!');
  }, [playerName, selectedNumbers, selectedPartnerId, addBet, validateForm]);

  const handleSendBets = async (): Promise<void> => {
    if (bets.length === 0) {
      toast.error('Não há apostas da Mega para enviar!');
      return;
    }

    const betsToSend = bets.map((bet: Bet) => ({
      ...bet,
      id: bet.id || generateUUID(),
      partnerId: bet.partnerId || selectedPartnerId,
    }));

    const result = await Swal.fire({
      title: 'Confirmar envio',
      text: 'Tem certeza que deseja enviar todas as suas apostas da Mega?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sim, enviar',
      cancelButtonText: 'Cancelar',
    });

    if (!result.isConfirmed) {
      toast('Envio cancelado.');
      return;
    }

    try {
      await betService.sendFilteredBets(betsToSend);
      toast.success('Apostas da Mega enviadas com sucesso!');
      clearBets();
    } catch (error) {
      toast.error('Erro ao enviar apostas da Mega.');
    }
  };


  const handlePlayerNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      setPlayerName(e.target.value);
    },
    []
  );

  const handlePartnerChange = useCallback(
    (value: string): void => {
      setSelectedPartnerId(value);
    },
    []
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6 lg:py-8">
        <Card className="shadow-xl border-0">
          <CardHeader className="pb-4 sm:pb-6">
            <CardTitle className="text-xl sm:text-2xl lg:text-3xl text-center bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
              Nova Aposta - MEGA
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="player-name">Nome do Jogador</Label>
              <Input
                id="player-name"
                type="text"
                value={playerName}
                onChange={handlePlayerNameChange}
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
                        {displayName} - {partner.megaSigla}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-3 block">Selecione {MAX_SELECTIONS} números</Label>
              <NumberGrid
                totalNumbers={TOTAL_NUMBERS}
                selectedNumbers={selectedNumbers}
                onToggleNumber={toggleNumber}
                selectedColor={SELECTED_COLOR}
                maxSelections={MAX_SELECTIONS}
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
                className="w-full sm:flex-1 h-11 text-base font-semibold bg-green-600 hover:bg-green-700"
              >
                Enviar Todas Apostas
              </Button>
            </div>

            <BetList bets={bets} onDelete={removeBet} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};


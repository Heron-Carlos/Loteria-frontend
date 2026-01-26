import { useState, useCallback, useMemo, useEffect } from 'react';
import { BetPageProps } from '../types/pages.types';
import { GameConfig } from '../types/component.types';
import { useBets } from '../hooks/useBets.hook';
import { useAuth } from '../hooks/useAuth.hook';
import { NumberGrid } from './NumberGrid';
import { SelectedNumbersPreview } from './SelectedNumbersPreview';
import { BetList } from './BetList';
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
import { formatPartnerName, normalizePlayerName } from '../utils/formatName';
import { filterValidPartners } from '../utils/validatePartners';
import { validateBetForm } from '../utils/validators/bet.validator';
import { createBet, prepareBetsForSending } from '../utils/betCreation';
import { confirmSendBets } from '../utils/confirmations';
import { Partner } from '../types/auth.types';
import { PartnerPaymentInfo } from '../types/partner.types';
import { getPartnerPaymentInfo } from '../services/partner-payment-info.service';
import { PaymentInfoModal } from './PaymentInfoModal';
import toast from 'react-hot-toast';

type BetPageCoreProps = BetPageProps & {
  gameConfig: GameConfig;
  filteredPartner?: Partner | null;
  isDefaultRoute?: boolean;
};

export const BetPage = ({ betService, authService, gameConfig, filteredPartner, isDefaultRoute }: BetPageCoreProps): JSX.Element => {
  const { partners } = useAuth(authService);
  const { bets, addBet, removeBet, clearBets } = useBets(betService, gameConfig.type);

  const [playerName, setPlayerName] = useState('');
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [selectedPartnerId, setSelectedPartnerId] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState<PartnerPaymentInfo[] | null>(null);
  const [selectedPartnerName, setSelectedPartnerName] = useState('');

  const validPartners = useMemo(() => {
    if (filteredPartner) {
      // Se houver um sócio filtrado, mostrar apenas ele
      return filterValidPartners([filteredPartner]);
    }
    
    // Se for rota padrão (sem sócio na URL), mostrar apenas o Jorge
    // Partner ID do Jorge: 5b53e8e8-f226-430d-91a3-760c74600a42
    if (isDefaultRoute) {
      const jorgePartnerId = '5b53e8e8-f226-430d-91a3-760c74600a42';
      const jorgePartner = partners.find((p) => p.partnerId === jorgePartnerId);
      if (jorgePartner) {
        return filterValidPartners([jorgePartner]);
      }
      // Se não encontrar o Jorge, retornar array vazio
      return [];
    }
    
    // Caso contrário, mostrar todos os sócios válidos
    return filterValidPartners(partners);
  }, [partners, filteredPartner, isDefaultRoute]);

  const partnerSiglaKey = gameConfig.type === 'Mega' ? 'megaSigla' : 'quinaSigla';

  useEffect(() => {
    if (validPartners.length > 0 && !selectedPartnerId) {
      setSelectedPartnerId(validPartners[0].partnerId);
    }
  }, [validPartners, selectedPartnerId]);

  // Se houver um sócio filtrado e ele mudar, atualizar o selectedPartnerId
  useEffect(() => {
    if (filteredPartner && filteredPartner.partnerId) {
      setSelectedPartnerId(filteredPartner.partnerId);
    }
  }, [filteredPartner]);

  const toggleNumber = useCallback((num: number): void => {
    setSelectedNumbers((prev) => {
      if (prev.includes(num)) {
        return prev.filter((n) => n !== num);
      }

      if (prev.length >= gameConfig.maxSelections) {
        return prev;
      }

      return [...prev, num];
    });
  }, [gameConfig.maxSelections]);

  const handleAddBet = useCallback((): void => {
    const validation = validateBetForm({
      playerName,
      selectedPartnerId,
      selectedNumbers,
      maxSelections: gameConfig.maxSelections,
      gameType: gameConfig.type,
    });

    if (!validation.isValid) {
      toast.error(validation.error || 'Erro de validação.');
      return;
    }

    const newBet = createBet({
      playerName,
      gameType: gameConfig.type,
      selectedNumbers,
      partnerId: selectedPartnerId,
    });

    addBet(newBet);
    setSelectedNumbers([]);
    toast.success(`Aposta na ${gameConfig.type} adicionada com sucesso!`);
  }, [playerName, selectedNumbers, selectedPartnerId, addBet, gameConfig]);

  const handleSendBets = useCallback(async (): Promise<void> => {
    if (bets.length === 0) {
      toast.error(`Não há apostas da ${gameConfig.type} para enviar!`);
      return;
    }

    const confirmed = await confirmSendBets({ gameType: gameConfig.type });
    
    if (!confirmed) {
      return;
    }

    const betsToSend = prepareBetsForSending({ bets, defaultPartnerId: selectedPartnerId });

    setIsSending(true);
    try {
      await betService.sendFilteredBets(betsToSend);
      toast.success(`Apostas da ${gameConfig.type} enviadas com sucesso!`);
      
      const selectedPartner = filteredPartner || validPartners.find((p) => p.partnerId === selectedPartnerId);
      const partnerName = selectedPartner ? formatPartnerName(selectedPartner.username) : '';
      setSelectedPartnerName(partnerName);

      const info = await getPartnerPaymentInfo(selectedPartnerId);
      setPaymentInfo(info);
      
      clearBets();
      setSelectedNumbers([]);
      setPlayerName('');
    } catch (error) {
      toast.error(`Erro ao enviar apostas da ${gameConfig.type}.`);
    } finally {
      setIsSending(false);
    }
  }, [bets, selectedPartnerId, betService, clearBets, gameConfig.type, validPartners, filteredPartner]);

  const handlePlayerNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    // Durante a digitação, não usar trim para permitir espaços
    const normalized = normalizePlayerName(e.target.value, false);
    setPlayerName(normalized);
  }, []);

  const handlePartnerChange = useCallback((value: string): void => {
    setSelectedPartnerId(value);
  }, []);

  const selectPlaceholder = validPartners.length === 0
    ? 'Nenhum sócio disponível'
    : 'Selecione o sócio';

  return (
    <div className={`min-h-screen ${gameConfig.bgGradient}`}>
      <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6 lg:py-8">
        <Card className="shadow-xl border-0">
          <CardHeader className="pb-4 sm:pb-6">
            <CardTitle className={`text-xl sm:text-2xl lg:text-3xl text-center bg-gradient-to-r ${gameConfig.gradientFrom} ${gameConfig.gradientTo} bg-clip-text text-transparent`}>
              {gameConfig.title}
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
              {filteredPartner ? (
                // Se houver um sócio filtrado, mostrar como texto (desabilitado)
                <div className="h-10 sm:h-11 px-3 py-2 bg-gray-100 rounded-md border border-gray-300 flex items-center">
                  <span className="text-gray-700">
                    {formatPartnerName(filteredPartner.username)} - {filteredPartner[partnerSiglaKey]}
                  </span>
                </div>
              ) : (
                <Select value={selectedPartnerId} onValueChange={handlePartnerChange}>
                  <SelectTrigger id="partner-select" className="h-10 sm:h-11">
                    <SelectValue placeholder={selectPlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {validPartners.map((partner) => {
                      const displayName = formatPartnerName(partner.username);
                      const sigla = partner[partnerSiglaKey];
                      return (
                        <SelectItem key={partner.id} value={partner.partnerId}>
                          {displayName} - {sigla}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div>
              <Label className="mb-3 block">
                Selecione {gameConfig.maxSelections} números
              </Label>
              <NumberGrid
                totalNumbers={gameConfig.totalNumbers}
                selectedNumbers={selectedNumbers}
                onToggleNumber={toggleNumber}
                selectedColor={gameConfig.selectedColor}
                maxSelections={gameConfig.maxSelections}
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
                className={`w-full sm:flex-1 h-11 text-base font-semibold ${gameConfig.buttonColor} ${gameConfig.buttonHoverColor} disabled:opacity-50 disabled:cursor-not-allowed`}
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
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
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
      {paymentInfo && (
        <PaymentInfoModal
          paymentInfo={paymentInfo}
          partnerName={selectedPartnerName}
          onClose={() => setPaymentInfo(null)}
        />
      )}
    </div>
  );
};


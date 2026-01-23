import axios from 'axios';
import { IBetService } from '../interfaces/services.interface';
import { Bet, CreateBetRequest, PaginatedBetsResponse } from '../types/bet.types';
import { IAuthService } from '../interfaces/services.interface';
import { addSequentialNumbersToDuplicateNames } from '../utils/bet.utils';

const getApiBaseUrl = (): string => {
  const url = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  // Remover barra no final se existir
  return url.replace(/\/$/, '');
};

const API_BASE_URL = getApiBaseUrl();
const API_URL = `${API_BASE_URL}/api/bets`;

export class BetService implements IBetService {
  private localBets: Bet[] = [];
  private authService: IAuthService;

  constructor(authService: IAuthService) {
    this.authService = authService;
    this.loadLocalBets();
  }

  private loadLocalBets(): void {
    const stored = localStorage.getItem('bets');
    if (stored) {
      this.localBets = JSON.parse(stored);
    }
  }

  private saveLocalBets(): void {
    localStorage.setItem('bets', JSON.stringify(this.localBets));
  }

  async createBet(request: CreateBetRequest): Promise<string> {
    const response = await axios.post<{ id: string }>(API_URL, request);
    return response.data.id;
  }

  async getPartnerBets(
    _partnerId: string, 
    gameType?: string, 
    search?: string, 
    isPaid?: boolean,
    page?: number,
    limit?: number
  ): Promise<PaginatedBetsResponse> {
    const headers = this.authService.getAuthHeader();
    const params: Record<string, string> = {};
    
    if (gameType) {
      params.gameType = gameType;
    }
    
    if (search && search.trim()) {
      params.search = search.trim();
    }

    if (isPaid !== undefined) {
      params.isPaid = isPaid.toString();
    }

    // Adiciona parâmetros de paginação
    params.page = (page || 1).toString();
    params.limit = (limit || 50).toString();

    const response = await axios.get<PaginatedBetsResponse>(`${API_URL}/partner`, {
      headers,
      params,
    });

    return response.data;
  }

  async getPublicPartnerBets(partnerId: string, gameType?: string): Promise<Bet[]> {
    const params: Record<string, string> = {};
    
    if (gameType) {
      params.gameType = gameType;
    }

    const response = await axios.get<PaginatedBetsResponse>(`${API_URL}/public/${partnerId}`, {
      params,
    });

    return response.data.bets;
  }

  async exportPartnerBetsToExcel(gameType?: string, isPaid?: boolean): Promise<Blob> {
    const headers = this.authService.getAuthHeader();
    const params: Record<string, string> = {};
    
    if (gameType) {
      params.gameType = gameType;
    }
    
    if (isPaid !== undefined) {
      params.isPaid = isPaid.toString();
    }

    const response = await axios.post(
      `${API_URL}/partner/export`,
      {},
      {
        headers,
        params,
        responseType: 'blob',
      }
    );

    return response.data;
  }

  async updateBetPaidStatus(betId: string, isPaid: boolean): Promise<void> {
    const headers = this.authService.getAuthHeader();
    await axios.put(
      `${API_URL}/${betId}/paid?isPaid=${isPaid}`,
      null,
      { headers }
    );
  }

  async deleteBet(betId: string): Promise<void> {
    const headers = this.authService.getAuthHeader();
    await axios.delete(`${API_URL}/${betId}`, { headers });
  }

  async getPartnerStats(_partnerId: string): Promise<{ total: number; paid: number; pending: number; mega: number; quina: number }> {
    const headers = this.authService.getAuthHeader();
    const response = await axios.get<{ total: number; paid: number; pending: number; mega: number; quina: number }>(`${API_URL}/partner/stats`, {
      headers,
    });
    return response.data;
  }

  addLocalBet(bet: Bet): void {
    this.localBets = [...this.localBets, bet];
    this.saveLocalBets();
  }

  removeLocalBet(bet: Bet): void {
    this.localBets = this.localBets.filter(
      (b) =>
        !(
          b.playerName === bet.playerName &&
          b.gameType === bet.gameType &&
          JSON.stringify(b.selectedNumbers) ===
            JSON.stringify(bet.selectedNumbers)
        )
    );
    this.saveLocalBets();
  }

  getLocalBets(): Bet[] {
    return [...this.localBets];
  }

  clearLocalBets(): void {
    this.localBets = [];
    localStorage.removeItem('bets');
  }

  clearFilteredLocalBets(gameType: string): void {
    this.localBets = this.localBets.filter((bet) => bet.gameType !== gameType);
    this.saveLocalBets();
  }

  async sendFilteredBets(bets: Bet[]): Promise<void> {
    const firstBet = bets[0];
    const gameType = firstBet?.gameType;
    const partnerId = firstBet?.partnerId;
    
    if (!partnerId) {
      throw new Error('Partner ID não encontrado nas apostas.');
    }
    
    // Busca apostas existentes usando a rota pública
    let existingBets: Bet[] = [];
    try {
      existingBets = await this.getPublicPartnerBets(partnerId, gameType);
    } catch (error) {
      // Se houver erro ao buscar apostas existentes, continua sem elas
      console.warn('Não foi possível buscar apostas existentes. Continuando sem numeração sequencial.', error);
    }
    
    const betsWithNumberedNames = addSequentialNumbersToDuplicateNames(bets, existingBets);
    
    const requests = betsWithNumberedNames.map((bet) => {
      const request: CreateBetRequest = {
        playerName: bet.playerName,
        gameType: bet.gameType,
        selectedNumbers: bet.selectedNumbers,
        partnerId: bet.partnerId,
      };
      return this.createBet(request);
    });

    await Promise.all(requests);
  }
}


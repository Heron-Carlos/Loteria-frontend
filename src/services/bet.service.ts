import axios from 'axios';
import { IBetService } from '../interfaces/services.interface';
import { Bet, CreateBetRequest } from '../types/bet.types';
import { IAuthService } from '../interfaces/services.interface';

const API_URL = '/api/bets';

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

  async getPartnerBets(_partnerId: string, gameType?: string): Promise<Bet[]> {
    const headers = this.authService.getAuthHeader();
    const params = gameType ? { gameType } : {};

    const response = await axios.get<Bet[]>(`${API_URL}/partner`, {
      headers,
      params,
    });

    return response.data;
  }

  async exportPartnerBetsToExcel(gameType?: string): Promise<Blob> {
    const headers = this.authService.getAuthHeader();
    const params = gameType ? { gameType } : {};

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
    const requests = bets.map((bet) => {
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


import { Bet, CreateBetRequest, PaginatedBetsResponse } from '../types/bet.types';
import { LoginRequest, LoginResponse, RegisterRequest, Partner } from '../types/auth.types';

export interface IBetService {
  createBet(request: CreateBetRequest): Promise<string>;
  getPartnerBets(partnerId: string, gameType?: string, search?: string, isPaid?: boolean, page?: number, limit?: number): Promise<PaginatedBetsResponse>;
  getPublicPartnerBets(partnerId: string, gameType?: string): Promise<Bet[]>;
  getPartnerStats(partnerId: string): Promise<{ total: number; paid: number; pending: number; mega: number; quina: number }>;
  exportPartnerBetsToExcel(gameType?: string, isPaid?: boolean): Promise<Blob>;
  updateBetPaidStatus(betId: string, isPaid: boolean): Promise<void>;
  deleteBet(betId: string): Promise<void>;
  addLocalBet(bet: Bet): void;
  removeLocalBet(bet: Bet): void;
  getLocalBets(): Bet[];
  clearLocalBets(): void;
  clearFilteredLocalBets(gameType: string): void;
  sendFilteredBets(bets: Bet[]): Promise<void>;
}

export interface IAuthService {
  login(request: LoginRequest): Promise<LoginResponse>;
  register(request: RegisterRequest): Promise<void>;
  logout(): void;
  isLoggedIn(): boolean;
  getCurrentUser(): LoginResponse | null;
  getAuthHeader(): Record<string, string>;
  getAllPartners(): Promise<Partner[]>;
}


import { Bet, CreateBetRequest } from '../types/bet.types';
import { LoginRequest, LoginResponse, RegisterRequest, Partner } from '../types/auth.types';

export interface IBetService {
  createBet(request: CreateBetRequest): Promise<string>;
  getPartnerBets(partnerId: string, gameType?: string, search?: string, isPaid?: boolean): Promise<Bet[]>;
  getPublicPartnerBets(partnerId: string, gameType?: string): Promise<Bet[]>;
  exportPartnerBetsToExcel(gameType?: string): Promise<Blob>;
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

